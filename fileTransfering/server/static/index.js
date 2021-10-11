const list = document.getElementById("file-list");
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

    if (list) {
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
    const input = document.getElementById("input");
    if (!input || !input.files || input.files.length < 1) {
        return;
    }
    const selectedFile = input.files[0]
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
        } else {
            console.log(response.statusText);
        }
    } catch {

    }
};

getFiles();
