// Shared constants and helpers for the extension content scripts.
// Loaded before content.js, exposes globals under `EmailAssistant`.

const API_BASE_URL = 'http://localhost:8080';

const GMAIL_SELECTORS = {
  emailContent: ['.h7', '.a3s.aiL', '.gmail_quote', '[role="presentation"]'],
  composeToolbar: ['.btC', '.aDh', '[role="toolbar"]', '.gU.Up'],
  composeWindow: ['.aDh', '.btC', '[role="dialog"]'],
  composeBox: ['[role="textbox"][g_editable="true"]'],
};

/**
 * Returns the first element matching any of the given selectors, or null.
 */
function findFirstElement(selectors, root = document) {
  for (const selector of selectors) {
    const element = root.querySelector(selector);
    if (element) {
      return element;
    }
  }
  return null;
}

/**
 * Returns the trimmed text of the first element matching any selector, or ''.
 */
function findFirstElementText(selectors, root = document) {
  const element = findFirstElement(selectors, root);
  return element ? element.innerText.trim() : '';
}

/**
 * Calls the backend and returns the generated reply as text.
 */
async function generateEmailReply({ emailContent, tone }) {
  const response = await fetch(`${API_BASE_URL}/api/email/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ emailContent, tone }),
  });

  if (!response.ok) {
    throw new Error('API Request Failed');
  }

  return response.text();
}

globalThis.EmailAssistant = {
  API_BASE_URL,
  GMAIL_SELECTORS,
  findFirstElement,
  findFirstElementText,
  generateEmailReply,
};
