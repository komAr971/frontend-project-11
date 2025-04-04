import onChange from "on-change";

const render = (elements, state, i18nInstance) => (path, value) => {
  console.log(state);
  switch (path) {
    case "process": {
      switch (value) {
        case "filling": {
          break;
        }
        case "processing": {
          elements.feedback.textContent = "";
          break;
        }
        case "failed": {
          elements.feedback.textContent = state.errors.join("\n");
          break;
        }
        case "success": {
          elements.feedback.textContent = "";
          elements.feeds.innerHTML = "";
          elements.posts.innerHTML = "";

          const postCard = document.createElement("div");
          postCard.classList.add("card", "border-0");

          const postCardBody = document.createElement("div");
          postCardBody.classList.add("card-body");

          const postCardTitle = document.createElement("h2");
          postCardTitle.classList.add("card-title", "h4");
          postCardTitle.textContent = i18nInstance.t("postsTitle");
          postCardBody.appendChild(postCardTitle);

          postCard.appendChild(postCardBody);

          const postsUl = document.createElement("ul");
          postsUl.classList.add("list-group", "border-0", "rounded-0");

          state.posts.forEach((post) => {
            const postLi = document.createElement("li");
            postLi.classList.add(
              "list-group-item",
              "d-flex",
              "justify-content-between",
              "align-items-start",
              "border-0",
              "border-end-0",
            );

            const postA = document.createElement("a");
            postA.classList.add("fw-bold");
            postA.setAttribute("href", post.link);
            postA.setAttribute("data-id", post.id);
            postA.setAttribute("target", "_blank");
            postA.setAttribute("rel", "noopener noreferrer");
            postA.textContent = post.title;

            const postButton = document.createElement("button");
            postButton.classList.add("btn", "btn-outline-primary", "btn-sm");
            postButton.setAttribute("type", "button");
            postButton.setAttribute("data-id", post.id);
            postButton.setAttribute("data-bs-toggle", "modal");
            postButton.setAttribute("data-bs-target", "#modal");
            postButton.textContent = i18nInstance.t("postButton");

            postLi.appendChild(postA);
            postLi.appendChild(postButton);

            postsUl.appendChild(postLi);
          });

          postCard.appendChild(postsUl);
          elements.posts.appendChild(postCard);

          const feedCard = document.createElement("div");
          feedCard.classList.add("card", "border-0");

          const feedCardBody = document.createElement("div");
          feedCardBody.classList.add("card-body");

          const feedCardTitle = document.createElement("h2");
          feedCardTitle.classList.add("card-title", "h4");
          feedCardTitle.textContent = i18nInstance.t("feedsTitle");
          feedCardBody.appendChild(feedCardTitle);

          feedCard.appendChild(feedCardBody);

          const feedUl = document.createElement("ul");
          feedUl.classList.add("list-group", "border-0", "rounded-0");

          state.feeds.forEach((feed) => {
            const feedLi = document.createElement("li");
            feedLi.classList.add("list-group-item", "border-0", "border-end-0");

            const feedH3 = document.createElement("h3");
            feedH3.classList.add("h6", "m-0");
            feedH3.textContent = feed.title;

            const feedP = document.createElement("p");
            feedP.classList.add("m-0", "small", "text-black-50");
            feedP.textContent = feed.description;

            feedLi.appendChild(feedH3);
            feedLi.appendChild(feedP);

            feedUl.appendChild(feedLi);
          });

          feedCard.appendChild(feedUl);

          elements.feeds.appendChild(feedCard);

          break;
        }
        default: {
          break;
        }
      }
      break;
    }

    case "errors": {
      break;
    }

    case "lng": {
      const active = elements.languageSelection.querySelector(".active");
      active.classList.remove("active");
      const current = elements.languageSelection.querySelector(
        `[data-lng="${value}"]`,
      );
      current.classList.add("active");

      i18nInstance.changeLanguage(value).then(() => {
        document.title = i18nInstance.t("title");
        elements.title.textContent = i18nInstance.t("title");
        elements.lead.textContent = i18nInstance.t("lead");
        elements.fields.url.placeholder = i18nInstance.t("input.placeholder");
        elements.label.textContent = i18nInstance.t("input.label");
        elements.submitButton.textContent = i18nInstance.t("button");
        elements.example.textContent = i18nInstance.t("example");
        elements.createdBy.textContent = i18nInstance.t("created by");
        elements.author.textContent = i18nInstance.t("author");
        elements.feeds.querySelector(".card-title").textContent =
          i18nInstance.t("feedsTitle");
        elements.posts.querySelector(".card-title").textContent =
          i18nInstance.t("postsTitle");
        const postButtons = document.querySelectorAll(".posts .btn");
        postButtons.forEach((btn) => {
          btn.textContent = i18nInstance.t("postButton");
        });
      });
      break;
    }

    default:
      break;
  }
};

export default (elements, state, i18nInstance) => {
  const watchedState = onChange(state, render(elements, state, i18nInstance));
  return watchedState;
};
