const exisitingVideos = {};

const colorGreen = "#00ff00";
const colorWhite = "#ffffff";
const colorBlack = "#000000";

const createHash = str => {
  var hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  if (hash < 0) {
    hash *= -1;
  }
  return hash;
};

const updateElementColor = (el, color) => {
  try {
    el.style.backgroundColor = color;
  } catch (err) {
    console.error(err);
  }
};

const copyContentToClipboard = (text, downloadButton) => {
  let pendingEvent;
  return function fallbackCopyTextToClipboard() {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    downloadButton.parentNode.insertBefore(
      textArea,
      downloadButton.nextSibling
    );
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      if (successful) {
        updateElementColor(downloadButton, colorGreen);
        if (pendingEvent) {
          clearTimeout(pendingEvent);
          pendingEvent = null;
        }
        pendingEvent = setTimeout(() => {
          updateElementColor(downloadButton, colorWhite);
        }, 5000);
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    downloadButton.parentElement.removeChild(textArea);
  };
};

const createDownloadButton = (doc, source, parent) => {
  const downloadButton = doc.createElement("button");
  downloadButton.setAttribute("id", createHash(source));
  downloadButton.setAttribute("href", source);
  downloadButton.setAttribute("class", "video-grabber-button");
  downloadButton.innerHTML = "Download";
  downloadButton.style.height = "20px";
  downloadButton.style.color = colorBlack;
  downloadButton.style.height = "20px";
  downloadButton.style.width = "100px";
  downloadButton.style.background = "white";
  downloadButton.style.top = "0px";
  downloadButton.style.left = "0px";
  downloadButton.style.zIndex = "3000";
  downloadButton.style.position = "absolute";
  downloadButton.style.fontSize = "12px";
  downloadButton.style.fontWeight = "bold";
  downloadButton.style.margin = "20px";
  downloadButton.onclick = copyContentToClipboard(source, downloadButton);
  parent.parentNode.insertBefore(downloadButton, parent.nextSibling);
};

const getVideoFiles = doc => {
  const videos = doc.getElementsByTagName("video");
  for (let ii = 0; ii < videos.length; ++ii) {
    const video = videos[ii];
    if (video.src && !exisitingVideos[createHash(video.src)]) {
      createDownloadButton(doc, video.src, video);
      exisitingVideos[createHash(video.src)] = true;
    }
  }
};

setInterval(() => {
  getVideoFiles(document);
}, 1000);
