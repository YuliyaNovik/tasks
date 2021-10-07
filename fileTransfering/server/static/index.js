const lists = document.getElementsByClassName("file-list");
const API_URL = "http://localhost:3000";

// имя файла с пробелом
// обработчики хорошего ответа и не очень (лог статусов)
// на сервере разные статусы возвращать
// на сервере try catch во всех запросах
// добавить fetch
// ресурсы с одним именем
// сброс имени файла

const addFileToList = (list, file) => {
    const li = document.createElement("li");
    if (file.mediaType && file.mediaType.startsWith("image/")) {
        li.innerHTML = `<a href="${API_URL}/files/${file.id}">
                            <img src="${API_URL}/files/${file.id}"/>
                            ${file.name}
                        </a>`;
    } else {
        li.innerHTML = `<a href="${API_URL}/files/${file.id}">${file.name}</a>`;
    }
    li.addEventListener("click", () => getFile(file.id));
    list.appendChild(li);
};

const getFiles = () => {
    const xHttp = new XMLHttpRequest();
    xHttp.onload = function (data) {
        const files = JSON.parse(xHttp.response);
        if (lists && lists[0]) {
            const list = lists[0];
            list.innerHTML = "";
            for (const file of files) {
                addFileToList(list, file);
            }
        }
    };
    xHttp.open("GET", "/files", true);
    xHttp.send();
};

const getFile = (name) => {
    const xHttp = new XMLHttpRequest();
    xHttp.open("GET", "/files/" + name, true);
    xHttp.send();
};

const upload = () => {
    const selectedFile = document.getElementById("input").files[0];
    const formData = new FormData();
    formData.append("file", selectedFile);

    const xHttp = new XMLHttpRequest();
    xHttp.onload = function () {
        console.log("Uploaded");
    };
    xHttp.open("POST", "/files", true);
    xHttp.send(formData);
    return false;
};

getFiles();
