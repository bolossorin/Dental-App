export function toDataURL(url: string) {
  return new Promise((res) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        res(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  });
}


export const dataURLtoFile = (dataUrl, filename) => {
  let array = dataUrl.split(','), mime = array[0].match(/:(.*?);/)[1],
    newArray = atob(array[1]), n = newArray.length, u8array = new Uint8Array(n);
  while (n--) {
    u8array[n] = newArray.charCodeAt(n);
  }
  return new File([u8array], filename, {type: mime});
}
