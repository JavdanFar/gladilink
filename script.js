import { GBI } from "./lib.js"

window.addEventListener("DOMContentLoaded", () => {
  const ideaInput = GBI("ideaInput");
  ideaInput.value = "";
  const urlInput = GBI("urlInput");
  urlInput.value = "";
});

// =======***======= DarkMode Section =======***=======

document.body.dataset.theme = localStorage.getItem("theme") || "light";

const themeBTN = GBI("themeBTN");
const logo = GBI("logo")

themeBTN.addEventListener("click", () => {
  const body = document.body.dataset;
  const themeIcon = GBI("themeIcon")
  if (body.theme === "dark") {
    localStorage.setItem("theme", "light");
    body.theme = localStorage.getItem("theme");
    themeIcon.classList.replace("fa-sun", "fa-moon")
    logo.src = "../Assets/logo/batman-black.png"
  }
  else {
    localStorage.setItem("theme", "dark");
    body.theme = localStorage.getItem("theme");
    themeIcon.classList.replace("fa-moon", "fa-sun")
    logo.src = "../Assets/logo/batman-white.png"
  }
});


// =======***======= Validate URL Section =======***=======

const isValidURL = (url) => {
  try {
    const parsedURL = new URL(url)
    const allowedProtocols = ["http:", "https:"]

    if (!allowedProtocols.includes(parsedURL.protocol)) {
      return false
    }
    return true
  }
  catch {
    return false
  }
}

const validateURL = (url) => {
  if (!url.trim()) {
    return [false, 'URL cannot be empty.']
  }

  if (url.length > 1000) {
    return [false, 'URL is too long. Maximum length is 1000 characters.']
  }

  if (/\s/.test(url)) {
    return [false, 'URL should not contain spaces.']
  }

  if (!isValidURL(url)) {
    return [false, 'Invalid or unsupported URL format.']
  }

  return [true, 'URL is valid']
}


// =======***======= Change Input Style Section =======***=======

let inputController = (userInputId, inputLabelId, inputLabelValue, helperTextId, submitBTNId, maxLen, validationCallback) => {

  let userInput = GBI(userInputId)
  let inputLabel = GBI(inputLabelId)
  let helperText = GBI(helperTextId)
  const submitBTN = GBI(submitBTNId)

  userInput.addEventListener("input", (e) => {
    let inputLen = e.target.value.length

    inputLabel.innerHTML = inputLen ? `${inputLabelValue} (${inputLen}/${maxLen}) <span class="red-star">*</span>` :
      `${inputLabelValue} <span class="red-star">*</span>`

    let [isValid, Message] = validationCallback(e.target.value)

    if (isValid) {
      if (validationCallback === validateURL) {
        userInput.style.borderColor = "var(--color-success)"
      } else {
        userInput.style.borderColor = "var(--color-primary)"
      }
      helperText.style.color = "var(--color-success)"
      submitBTN.classList.remove("disable")
      submitBTN.disabled = false
    } else {
      userInput.style.borderColor = "var(--color-alert)"
      helperText.style.color = "var(--color-alert)"
      submitBTN.classList.add("disable")
      submitBTN.disabled = true
    }

    helperText.innerText = Message
  })
}


let inputDefault = function (userInputId, inputLabelId, inputLabelValue, helperTextId, submitBTNId) {
  let userInput = GBI(userInputId)
  let inputLabel = GBI(inputLabelId)
  let helperText = GBI(helperTextId)
  const submitBTN = GBI(submitBTNId)

  inputLabel.innerHTML = `${inputLabelValue} <span class="red-star">*</span>`
  userInput.value = ""
  userInput.style.borderColor = "var(--color-mist-extra)"
  helperText.innerText = ""
  submitBTN.classList.add("disable")
  submitBTN.disabled = true
}


// =======***======= Change URL Input Style Section =======***=======

inputController("urlInput", "urlInputLabel", "Long URL", "URLhelperText", "generateBTN", 1000, validateURL)


// =======***======= Generate Section =======***=======

const shortLink = GBI("shortLink")
const inputCard = GBI("inputCard")
const resultCard = GBI("resultCard")

generateBTN.addEventListener("click", async function () {
  let urlValue = GBI("urlInput").value

  toastHandler("Short URL is generating...", 'loading', 99999999)
  try {

    const response = await fetch("https://phly.ir/api/links/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "url": urlValue
      })
    })

    let result = await response.json()
    let output = `https://phly.ir/${result.data.code}`
    shortLink.href = output
    shortLink.innerText = output

    inputCard.style.display = "none"
    resultCard.style.display = "flex"

    toastMessage.style.display = "none"
    toastHandler("Short URL generated successfully", "ok")
  } catch (error) {
    toastHandler("Failed to generate short URL!", "error")
  }
})


// =======***======= Copy BTN Section =======***=======

const handleCopy = async (shortUrl) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(shortUrl);
      toastHandler("URL copied to clipboard!", "ok")
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = shortUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '0';
      textArea.style.top = '0';
      textArea.style.opacity = '1';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove()
      toastHandler("URL copied to clipboard!", "ok")
    }
  } catch (error) {
    console.error('Failed to copy: ', error);
    toastHandler("Failed to copy URL", "error")
  }
}

const copyBTN = GBI("copyBTN")

copyBTN.addEventListener("click", () => {
  handleCopy(shortLink.href)
})
// =======***======= New BTN Section =======***=======

const newBTN = GBI("newBTN")

newBTN.addEventListener("click", () => {
  inputCard.style.display = "flex"
  resultCard.style.display = "none"

  inputDefault("urlInput", "urlInputLabel", "Long URL", "URLhelperText", "generateBTN");
})


// =======***======= Validate Idea Section =======***=======

const validateIdea = (idea) => {
  if (!idea.trim()) {
    return [false, 'Idea cannot be empty.']
  }

  if (idea.length > 2048) {
    return [false, 'URL is too long. Maximum length is 2048 characters.']
  }

  return [true, '']
}


// =======***======= Change Idea Input Style Section =======***=======

inputController("ideaInput", "ideaInputLabel", "Your Idea", "ideaHelperText", "ideaSubmitBTN", 2048, validateIdea)

// =======***======= Open and Close Modal Section =======***=======

const modalHandler = function (modalBTNId, modalContainerId, closeBTNId) {
  const modalBTN = GBI(modalBTNId)
  const modalContainer = GBI(modalContainerId)
  const closeBTN = GBI(closeBTNId)

  modalBTN.addEventListener("click", () => {
    modalContainer.style.display = "flex"
  })

  closeBTN.addEventListener("click", () => {
    modalContainer.style.display = "none"
  })

  modalContainer.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
      modalContainer.style.display = "none"
    }
  })
}

modalHandler("ideaBTN", "ideaModalContainer", "ideaCloseBTN")

modalHandler("versionBTN", "versionModalContainer", "versionModalColseBTN")

// =======***======= Submit Idea Section =======***=======

ideaSubmitBTN.addEventListener("click", async function () {
  const ideaInput = GBI("ideaInput").value

  toastHandler("Submitting your idea...", "loading", 999999999)
  try {
    const response = await fetch("https://phly.ir/api/ideas/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "idea": ideaInput
      })
    })
    toastMessage.style.display = "none"

    ideaModalContainer.style.display = "none"
    toastHandler("Your Idea Sent Successfully", "ok")

  } catch (error) {
    toastHandler("There is a problem in send your idea!", "error")
  }

  inputDefault("ideaInput", "ideaInputLabel", "Your Idea", "ideaHelperText", "ideaSubmitBTN");
})


// =======***======= Toast Message Section =======***=======

function toastHandler(text, status = "loading", duration = 3000) {
  let toastMessage = GBI("toastMessage")
  let toastMessageIcon = GBI("toastMessageIcon")

  toastMessage.style.display = "flex"
  toastText.innerText = text

  if (status === "loading") {
    toastMessageIcon.className = "fas fa-circle-notch fa-spin"

  } else if (status === "ok") {
    toastMessageIcon.className = "fa-solid fa-circle-check"

  } else {
    toastMessageIcon.className = "fa-solid fa-circle-xmark"
  }

  setTimeout(() => {
    toastMessage.style.display = "none"
  }, duration)
}

// toastHandler("Short URL is generating...")
// toastHandler("Short URL generated successfully","ok")
// toastHandler("Some thing is wrong!","error")