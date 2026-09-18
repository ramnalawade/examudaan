import os
import re
import logging
from typing import Optional


class GeminiKeyManager:
    """
    Manages a pool of Gemini API keys with automatic rotation on 429 errors.

    Configure multiple keys (comma/semicolon/space separated) in .env:
        GEMINI_API_KEY=key1,key2,key3

    When a key hits a 429/quota error, call mark_exhausted(key).
    The next call to get_current_key() will return the next available key.

    Uses the new google-genai SDK (google.genai) — the old google-generativeai
    package is deprecated and no longer receives updates.
    """

    # Class-level set: shared across all instances in the same process
    _exhausted_keys: set = set()

    # ── Current confirmed-working model fallback chain ──
    # These model names are for the new google.genai SDK (no "models/" prefix needed).
    # gemini-flash-lite-latest → always points to the current lightest free-tier flash
    MODEL_FALLBACK_CHAIN = [
        "gemini-flash-lite-latest",   # → gemini-2.5-flash-lite (free tier, fast)
        "gemini-flash-latest",        # → gemini-2.5-flash
        "gemini-2.5-flash-lite",      # explicit version
        "gemini-2.5-flash",           # higher quality
        "gemini-3.5-flash-lite",      # next gen lite
        "gemini-3.5-flash",           # next gen
    ]

    # Default model (cheapest/fastest on the free tier)
    DEFAULT_MODEL = "gemini-flash-lite-latest"

    def __init__(self, logger=None):
        self.logger = logger or logging.getLogger(__name__)
        api_key_str = os.environ.get("GEMINI_API_KEY", "")
        # Parse comma, semicolon, space, or newline separated keys
        # Filter out placeholder strings
        raw_keys = [k.strip() for k in re.split(r"[,;\s\n\r]+", api_key_str) if k.strip()]
        self.api_keys = [
            k for k in raw_keys
            if len(k) > 10 and "ADD_YOUR" not in k.upper() and "YOUR_KEY" not in k.upper()
        ]
        self.current_idx = 0

        if self.api_keys:
            count = len(self.api_keys)
            self.logger.info(
                f"GeminiKeyManager: Loaded {count} valid API key(s). "
                f"{'Key rotation enabled.' if count > 1 else 'Single key — add more keys for rotation.'}"
            )
        else:
            self.logger.warning("GeminiKeyManager: No valid GEMINI_API_KEY found in environment.")

    def get_current_key(self) -> Optional[str]:
        """Return the next non-exhausted key, or None if all exhausted."""
        if not self.api_keys:
            return None
        for i in range(len(self.api_keys)):
            idx = (self.current_idx + i) % len(self.api_keys)
            key = self.api_keys[idx]
            if key not in self._exhausted_keys:
                self.current_idx = idx
                return key
        return None   # all keys exhausted

    def mark_exhausted(self, key: str):
        """
        Mark a key as exhausted (hit 429/quota). Advances current_idx so the next
        get_current_key() call immediately tries the following key.
        """
        if key in self.api_keys and key not in self._exhausted_keys:
            masked = f"...{key[-6:]}" if len(key) > 6 else key
            self.logger.warning(
                f"GeminiKeyManager: Key {masked} EXHAUSTED (429/quota). "
                f"{self.get_working_keys_count() - 1} key(s) remaining."
            )
            self._exhausted_keys.add(key)
            idx = self.api_keys.index(key)
            self.current_idx = (idx + 1) % len(self.api_keys)

    def has_working_keys(self) -> bool:
        return len(self._exhausted_keys) < len(self.api_keys)

    def get_working_keys_count(self) -> int:
        return max(0, len(self.api_keys) - len(self._exhausted_keys))

    @classmethod
    def reset_exhausted(cls):
        """Reset exhausted keys pool (e.g., after midnight when quotas reset)."""
        cls._exhausted_keys = set()
