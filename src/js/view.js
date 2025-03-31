import onChange from "on-change";
import { setLocale } from "yup";

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
      const active = elements.languageSelection.querySelector('.active');
      active.classList.remove('active');
      const current = elements.languageSelection.querySelector(`[data-lng="${value}"]`)
      current.classList.add('active');

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
      })
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
