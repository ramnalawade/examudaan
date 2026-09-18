import { NextResponse } from 'next/server'
import { supabase } from '../../../../../lib/supabase'
import { withAuth } from '../../../../../lib/auth'

// ============================================================
// app/api/admin/jobs/[id]/route.js — Admin Job Update
// ============================================================

export const PATCH = withAuth(async (request, { params }, user) => {
  try {
    const { id } = params
    const updates = await request.json()

    if (!supabase) {
      return NextResponse.json({ success: true, message: 'Mock updated', data: { id, ...updates } })
    }

    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Admin job update error:', error)
    return NextResponse.json({ success: false, message: 'Failed to update job' }, { status: 500 })
  }
})
