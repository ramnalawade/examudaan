"""
title_cleaner.py — Automated Title Casing & Standardization for Scrapers
ExamUdaan | Formats titles to proper case ("Bima Sakhi", "Junior Engineer")
while preserving standard acronyms (MPSC, UPSC, SSC, RRB, LIC, ITI, etc.)
and preserving Marathi / Devanagari script untouched.
"""

import re

# Standard acronyms and capitalized certifications
ACRONYMS = {
    'mpsc': 'MPSC',
    'upsc': 'UPSC',
    'ssc': 'SSC',
    'bmc': 'BMC',
    'rrb': 'RRB',
    'lic': 'LIC',
    'aiims': 'AIIMS',
    'iti': 'ITI',
    'ncs': 'NCS',
    'drdo': 'DRDO',
    'isro': 'ISRO',
    'ongc': 'ONGC',
    'sbi': 'SBI',
    'ibps': 'IBPS',
    'tcs': 'TCS',
    'cbse': 'CBSE',
    'neet': 'NEET',
    'gate': 'GATE',
    'iit': 'IIT',
    'iim': 'IIM',
    'nit': 'NIT',
    'bsc': 'BSc',
    'msc': 'MSc',
    'btech': 'BTech',
    'mtech': 'MTech',
    'b.ed': 'B.Ed',
    'd.ed': 'D.Ed',
    'llb': 'LLB',
    'llm': 'LLM',
    'mbbs': 'MBBS',
    'bams': 'BAMS',
    'bhms': 'BHMS',
    'gnm': 'GNM',
    'anm': 'ANM',
    'po': 'PO',
    'je': 'JE',
    'aso': 'ASO',
    'psi': 'PSI',
    'sti': 'STI',
    'pdf': 'PDF',
    'zp': 'ZP',
    'ndrf': 'NDRF',
    'sdrf': 'SDRF',
    'cisf': 'CISF',
    'bsf': 'BSF',
    'crpf': 'CRPF',
    'itbp': 'ITBP',
    'ssb': 'SSB',
    'ugc': 'UGC',
    'net': 'NET',
    'set': 'SET',
    'csir': 'CSIR',
    'icar': 'ICAR',
    'icmr': 'ICMR',
    'barc': 'BARC',
    'hal': 'HAL',
    'bel': 'BEL',
    'bhel': 'BHEL',
    'ntpc': 'NTPC',
    'iocl': 'IOCL',
    'bpcl': 'BPCL',
    'hpcl': 'HPCL',
    'gail': 'GAIL',
    'sail': 'SAIL',
    'cgl': 'CGL',
    'chsl': 'CHSL',
    'mts': 'MTS',
    'gd': 'GD',
    'nda': 'NDA',
    'cds': 'CDS',
    'afcat': 'AFCAT',
    'nabard': 'NABARD',
    'sidbi': 'SIDBI',
    'sebi': 'SEBI',
    'rbi': 'RBI',
    'nhm': 'NHM',
    'mcgm': 'MCGM',
    'pmrda': 'PMRDA',
    'cidco': 'CIDCO',
    'mseb': 'MSEB',
    'mahagenco': 'MAHAGENCO',
    'mahatransco': 'MAHATRANSCO',
    'msedcl': 'MSEDCL',
    'srpf': 'SRPF',
    'pdkv': 'PDKV',
    'mecl': 'MECL',
    'neeri': 'NEERI',
    'actrec': 'ACTREC',
    'circot': 'CIRCOT',
    'nbss': 'NBSS',
    'iiser': 'IISER',
    'krcl': 'KRCL',
    'nta': 'NTA',
    'tet': 'TET',
}

# Minor connector words in English titles
MINOR_WORDS = {
    'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at',
    'to', 'from', 'by', 'with', 'in', 'of', 'as', 'via'
}

ROMAN_NUMERALS = {
    'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'
}

# Unicode range for Devanagari script (\u0900 - \u097F)
DEVANAGARI_PATTERN = re.compile(r'[\u0900-\u097F]')


def _format_word(word: str, is_first: bool = False, is_last: bool = False) -> str:
    """Format an individual word keeping punctuation, acronyms, and proper case intact."""
    if not word:
        return ''

    # Preserve Devanagari script as-is
    if DEVANAGARI_PATTERN.search(word):
        return word

    # Separate leading & trailing punctuation
    match = re.match(r'^([^a-zA-Z0-9]*)(.*?)([^a-zA-Z0-9]*)$', word)
    if not match:
        return word

    leading, core, trailing = match.groups()
    if not core:
        return word

    core_lower = core.lower()

    # 1. Known acronyms
    if core_lower in ACRONYMS:
        return f"{leading}{ACRONYMS[core_lower]}{trailing}"

    # 2. Roman numerals
    if core_lower in ROMAN_NUMERALS:
        return f"{leading}{core.upper()}{trailing}"

    # 3. Minor words (lowercase if not first/last)
    if not is_first and not is_last and core_lower in MINOR_WORDS:
        return f"{leading}{core_lower}{trailing}"

    # 4. Handle hyphenated or slash-separated subparts (e.g. "walk-in", "bima/agent")
    if '-' in core or '/' in core:
        delim = '-' if '-' in core else '/'
        parts = core.split(delim)
        formatted_parts = [
            _format_word(p, idx == 0 and is_first, idx == len(parts) - 1 and is_last)
            for idx, p in enumerate(parts)
        ]
        return f"{leading}{delim.join(formatted_parts)}{trailing}"

    # 5. Standard Title Casing (capital first letter, lowercase rest)
    formatted_core = core[0].upper() + core[1:].lower()
    return f"{leading}{formatted_core}{trailing}"


def clean_title_case(text: str) -> str:
    """
    Format job title to clean, proper case.
    
    Examples:
      "bima sakhi" -> "Bima Sakhi"
      "BIMA SAKHI" -> "Bima Sakhi"
      "mpsc civil judge recruitment 2026" -> "MPSC Civil Judge Recruitment 2026"
      "bmc junior engineer (civil)" -> "BMC Junior Engineer (Civil)"
      "महाराष्ट्र पोलीस भरती" -> "महाराष्ट्र पोलीस भरती" (untouched)
    """
    if not text or not isinstance(text, str):
        return text or ""

    text = text.strip()
    if not text:
        return ""

    # If pure Devanagari text without any latin words, leave untouched
    if DEVANAGARI_PATTERN.search(text) and not re.search(r'[a-zA-Z]', text):
        return text

    words = re.split(r'\s+', text)
    total = len(words)

    formatted = [
        _format_word(w, idx == 0, idx == total - 1)
        for idx, w in enumerate(words)
    ]
    return " ".join(formatted)
