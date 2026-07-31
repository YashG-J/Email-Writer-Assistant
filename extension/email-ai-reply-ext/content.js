console.log("Email Writer Extension - Content Script Loaded");

const {
    GMAIL_SELECTORS,
    findFirstElement,
    findFirstElementText,
    generateEmailReply
} = globalThis.EmailAssistant;

const BUTTON_LABEL = 'AI Reply';
const BUTTON_LOADING_LABEL = 'Generating...';

function createAIButton(){
    const button = document.createElement('div');
    button.className = 'T- J-J5-Ji ao0 v7 T-I-atl L3';
    button.style.marginRight= '8px';
    button.innerHTML = BUTTON_LABEL;
    button.setAttribute('role' , 'button');
    button.setAttribute('data-tooltip' , 'Generate AI Reply');
    return button;
}

function getEmailContent(){
    return findFirstElementText(GMAIL_SELECTORS.emailContent);
}

function findComposeToolbar(){
    return findFirstElement(GMAIL_SELECTORS.composeToolbar);
}

function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if(existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();
    if(!toolbar){
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar found, creating AI button");
    const button = createAIButton();
    button.classList.add('ai-reply-button');

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = BUTTON_LOADING_LABEL;
            button.disabled = true ;

            const generatedReply = await generateEmailReply({
                emailContent: getEmailContent(),
                tone: "professional"
            });
            const composeBox = findFirstElement(GMAIL_SELECTORS.composeBox);

            if(composeBox){
                composeBox.focus();
                document.execCommand('insertText',false,generatedReply);
            }else{
                console.error('Compose box was not found');
            }
        } catch (error) {
            console.error(error);
            alert('failed to generate reply ');
        }finally{
            button.innerHTML = BUTTON_LABEL;
            button.disabled=false;
        }

    });

    toolbar.insertBefore(button,toolbar.firstChild);
}

const composeWindowSelector = GMAIL_SELECTORS.composeWindow.join(', ');

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);

    const hasComposeElements = addedNodes.some((node) =>
      node.nodeType === Node.ELEMENT_NODE &&
      (
        node.matches(composeWindowSelector) ||
        node.querySelector(composeWindowSelector)
      )
    );

    if (hasComposeElements) {
      console.log("Compose Window Detected");
      setTimeout(injectButton, 500);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
