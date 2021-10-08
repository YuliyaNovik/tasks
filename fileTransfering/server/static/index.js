const lists = document.getElementsByClassName("file-list");
const API_URL = "http://localhost:3000";

// обработчики хорошего ответа и не очень (лог статусов)
// на сервере разные статусы возвращать

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    upload();
    form.reset();
    return false;
});

const addFileToList = (list, file) => {
    const li = document.createElement("li");

    // const link = `${API_URL}/files/${encodeURIComponent(file.id)}`;
    const link = `${API_URL}/files/${file.id}`;


    if (file.mediaType && file.mediaType.startsWith("image/")) {
        li.innerHTML = `<a href="${link}">
                            <img src="${link}"/>
                            ${file.name}
                        </a>`;
    } else {
        li.innerHTML = `<a href="${link}">${file.name}</a>`;
    }
    li.addEventListener("click", () => getFile(file.id));
    list.appendChild(li);
};

const getFiles = async () => {
    const response = await fetch("/files");
    const files = await response.json();

    if (lists && lists[0]) {
        const list = lists[0];
        list.innerHTML = "";

        for (const file of files) {
            addFileToList(list, file);
        }
    }
};

const getFile = async (name) => {
    const response = await fetch("/files/" + name);
};

const upload = async () => {
    const list = lists[0];
    const selectedFile = document.getElementById("input").files[0];
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
        const response = await fetch("/files", {
            method: "POST",
            body: formData,
        });
        if (response.status === 201) {
            console.log("Uploaded");
            addFileToList(list, { id: selectedFile.name, name: selectedFile.name, mediaType: selectedFile.type });
        }
    } catch {

    }
};

getFiles();
