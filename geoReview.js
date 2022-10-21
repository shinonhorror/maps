import InteractiveMap from "/interactiveMap.js";

export default class GeoReview {
  constructor() {
    this.formTemplate = document.querySelector("#addFormTemplate").innerHTML;
    this.map = new InteractiveMap("map", this.onClick.bind(this));
    this.map.init().then(this.onInit.bind(this));
  }

  async onInit() {
    let keys = Object.keys(localStorage);

    for (const key of keys) {
        const item = JSON.parse(localStorage.getItem(key))
        for (let i=0; i<item.length; i++) {
          this.map.createPlacemark(JSON.parse(key));
        } 
    }
    document.body.addEventListener("click", this.onDocumentClick.bind(this));
  }

  createForm(coords, reviews) {
    const root = document.createElement("div"); // Создание контейнера для формы
    root.innerHTML = this.formTemplate; // Вставить в HTML котейнера шаблон
    const reviewList = root.querySelector(".review-list");
    const reviewForm = root.querySelector("[data-role=review-form]");
    reviewForm.dataset.coords = JSON.stringify(coords);

    for (const item of reviews) {
      const div = document.createElement("div");
      div.classList.add("review-item");
      div.innerHTML = `
      <div>
        <b>Имя: ${item.name}</b> Место: ${item.place}
      </div>
      <p>Отзыв: ${item.text}</p>
      `;
      reviewList.appendChild(div);
    }

    return root;
  }

  onClick(coords) {
    this.map.openBalloon(coords);
    let keys = [...Object.keys(localStorage)];
    const list = [];
    for (const key of keys) {
      if (JSON.stringify(coords) === key) {
        const item = JSON.parse(localStorage.getItem(key))
        for (let i=0; i<item.length; i++) {
          list.push(item[i])
        } 
      }
    }
    const form = this.createForm(coords, list);
    this.map.setBalloonContent(form.innerHTML);
  }
  
  async onDocumentClick(e) {
    if (e.target.dataset.role === "review-add") {
      const reviewForm = document.querySelector("[data-role=review-form]");
      const coords = JSON.parse(reviewForm.dataset.coords);
      const data = {
          name: document.querySelector("[data-role=review-name]").value,
          place: document.querySelector("[data-role=review-place]").value,
          text: document.querySelector("[data-role=review-text]").value,
      };
      try {
        let array = [];
        let keys = Object.keys(localStorage);
        if (Object.keys(localStorage)) {
          for (const key of keys) {
            if (JSON.stringify(coords) === key) {
              array.push(...JSON.parse(localStorage.getItem(key)));
            }
          }
          array.push(data)
        }
        else {
          array.push(data)
        }
        localStorage.setItem(JSON.stringify(coords), JSON.stringify(array));
        this.map.createPlacemark(coords);
        this.map.closeBalloon();
      } catch (e) {
        const formError = document.querySelector(".form-error");
        formError.innerText = e.message;
      }
    }
  }
}
