// ============================================================
// app/api/admin/feedback/[id]/route.js — Admin Feedback Update & Resolution API
// ExamUdaan | Protected via withAdminAuth — handles status, approval, spam & notifications
// ============================================================

import { NextResponse } from 'next/server'
import { query } from '../../../../../lib/pgdb'
import { withAdminAuth } from '../../../../../lib/auth'
import {
  sendFeedbackResolutionEmail,
  getWhatsAppNotificationUrl,
} from '../../../../../lib/feedbackNotification'

// PATCH /api/admin/feedback/[id] — update status, approval, spam flag, resolution notes
async function patchHandler(request, { params }, user) {
  try {
    const { id } = await params
    const numId = parseInt(id, 10)
    if (!numId || isNaN(numId)) {
      return NextResponse.json({ error: 'Invalid feedback ID' }, { status: 400 })
    }

    const body = await request.json()
    const {
      status,
      is_approved,
      is_spam,
      resolution_notes,
      admin_notes,
      notify_user,
    } = body

    // 1. Fetch current feedback record
    const existing = await query('SELECT * FROM feedback WHERE id = $1', [numId])
    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: 'Feedback record not found' }, { status: 404 })
    }
    const current = existing[0]

    // 2. Build update fields
    const updates = []
    const values = []
    let pIdx = 1

    if (typeof status === 'string') {
      updates.push(`status = $${pIdx++}`)
      values.push(status)

      if (status === 'resolved' && current.status !== 'resolved') {
        updates.push(`resolved_at = NOW()`)
        updates.push(`resolved_by = $${pIdx++}`)
        values.push(user.email || 'admin@examudaan.in')
      } else if (status !== 'resolved') {
        updates.push(`resolved_at = NULL`)
        updates.push(`resolved_by = NULL`)
      }
    }

    if (typeof is_approved === 'boolean') {
      updates.push(`is_approved = $${pIdx++}`)
      values.push(is_approved)
      // If approving, ensure it's not marked as spam
      if (is_approved === true) {
        updates.push(`is_spam = FALSE`)
      }
    }

    if (typeof is_spam === 'boolean') {
      updates.push(`is_spam = $${pIdx++}`)
      values.push(is_spam)
      // If marking as spam, remove from approved website view
      if (is_spam === true) {
        updates.push(`is_approved = FALSE`)
      }
    }

    if (typeof resolution_notes === 'string') {
      updates.push(`resolution_notes = $${pIdx++}`)
      values.push(resolution_notes)
    }

    if (typeof admin_notes === 'string') {
      updates.push(`admin_notes = $${pIdx++}`)
      values.push(admin_notes)
    }

    updates.push(`updated_at = NOW()`)

    values.push(numId)
    const updateSql = `
      UPDATE feedback 
      SET ${updates.join(', ')}
      WHERE id = $${pIdx}
      RETURNING *
    `
    const updateRes = await query(updateSql, values)
    const updated = (updateRes)[0]

    // 3. User Notification Handling
    let notificationResult = {
      emailSent: false,
      whatsappUrl: null,
      message: null,
    }

    const contactStr = (updated.contact || '').trim()
    const finalResolutionNote = (updated.resolution_notes || resolution_notes || '').trim()

    if (notify_user && finalResolutionNote) {
      // Check if contact is an email
      if (contactStr.includes('@')) {
        const emailRes = await sendFeedbackResolutionEmail({
          email: contactStr,
          name: updated.name || 'Aspirant',
          ticketId: updated.reference_id,
          subject: updated.subject || 'ExamUdaan Query',
          resolutionNotes: finalResolutionNote,
        })
        notificationResult.emailSent = !!emailRes.success
        notificationResult.message = emailRes.success
          ? `Resolution email successfully dispatched to ${contactStr}`
          : `Email dispatch failed: ${emailRes.error}`
      }
      // Check if contact looks like a phone number
      const phoneDigits = contactStr.replace(/[^0-9]/g, '')
      if (phoneDigits.length >= 10) {
        const waUrl = getWhatsAppNotificationUrl({
          phone: contactStr,
          ticketId: updated.reference_id,
          subject: updated.subject || '',
          resolutionNotes: finalResolutionNote,
        })
        notificationResult.whatsappUrl = waUrl
      }
    } else if (contactStr.replace(/[^0-9]/g, '').length >= 10 && finalResolutionNote) {
      // Generate WhatsApp link always as helper for admin
      notificationResult.whatsappUrl = getWhatsAppNotificationUrl({
        phone: contactStr,
        ticketId: updated.reference_id,
        subject: updated.subject || '',
        resolutionNotes: finalResolutionNote,
      })
    }

    return NextResponse.json({
      success: true,
      feedback: updated,
      notification: notificationResult,
    })
  } catch (err) {
    console.error('[Admin Feedback PATCH error]', err)
    return NextResponse.json({ error: 'Failed to update feedback record' }, { status: 500 })
  }
}

// DELETE /api/admin/feedback/[id] — permanently delete a feedback entry
async function deleteHandler(request, { params }, user) {
  try {
    const { id } = await params
    const numId = parseInt(id, 10)
    if (!numId || isNaN(numId)) {
      return NextResponse.json({ error: 'Invalid feedback ID' }, { status: 400 })
    }

    await query('DELETE FROM feedback WHERE id = $1', [numId])
    return NextResponse.json({ success: true, message: 'Feedback record permanently deleted' })
  } catch (err) {
    console.error('[Admin Feedback DELETE error]', err)
    return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 })
  }
}

// Export both handlers wrapped with admin auth guard
export const PATCH = withAdminAuth(patchHandler)
export const DELETE = withAdminAuth(deleteHandler)
