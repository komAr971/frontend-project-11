import { string, setLocale } from "yup";
import i18next from "i18next";
import axios from 'axios';

import resources from "../locales/index.js";
import initView from "./view.js";
import rssParser from "./rssParser.js";

const languages = ["ru", "en"];

const handleSwitchLanguage = (state) => (evt) => {
  const { lng } = evt.target.dataset;

  state.lng = lng;
};

export default () => {
  const defaultLanguage = "ru";

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: defaultLanguage,
    resources,
  });

  setLocale({
    mixed: {
      notOneOf: () => i18nInstance.t("error.notOneOf"),
    },
    string: {
      url: () => i18nInstance.t("error.url"),
    },
  });

  const elements = {
    form: document.querySelector(".rss-form"),
    fields: {
      url: document.getElementById("url-input"),
    },
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector(".feedback"),
    title: document.querySelector(".title"),
    lead: document.querySelector(".lead"),
    label: document.querySelector('label[for="url-input"]'),
    example: document.querySelector(".example"),
    author: document.querySelector(".author"),
    createdBy: document.querySelector(".createdBy"),
    languageSelection: document.querySelector(".language-selection"),
  };

  const initialState = {
    lng: "",
    formData: {
      url: "",
    },
    errors: [],
    process: "filling", // "processing", "failed", "success"
    feedList: [],
    feeds: [],
    posts: []
  };

  const state = initView(elements, initialState, i18nInstance);

  languages.forEach((lng) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.classList.add("dropdown-item");
    if (lng === defaultLanguage) {
      button.classList.add("active");
    }
    button.setAttribute("type", "button");
    button.setAttribute("data-lng", lng);
    button.textContent = i18nInstance.t(`languages.${lng}`);
    li.appendChild(button);
    button.addEventListener("click", handleSwitchLanguage(state));
    elements.languageSelection.appendChild(li);
  });

  state.lng = defaultLanguage;

  const validateForm = () => {
    const schema = string().url().notOneOf(state.feedList);

    return schema
      .validate(state.formData.url)
      .then()
      .catch((err) => {
        state.errors = err.errors;
      });
  };

  elements.fields.url.addEventListener("input", (e) => {
    state.formData.url = e.target.value.trim();
  });

  elements.form.addEventListener("submit", (e) => {
    e.preventDefault();

    state.process = "processing";
    state.errors = [];

    validateForm().then(() => {
      if (state.errors.length > 0) {
        state.process = "failed";
        return;
      }

      return axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(state.formData.url)}`);
    }).then((result) => {
      const { feed, posts } = rssParser(result.data.contents);
      console.log(feed);
      console.log(posts);
      console.log(result.data.contents);
    });
  });
};
