import onChange from 'on-change';

const render = (els, state, i18nInstance) => {
  const elements = els;
  elements.feedback.textContent = '';
  elements.feeds.innerHTML = '';
  elements.posts.innerHTML = '';

  if (state.errors.length > 0) {
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.feedback.textContent = state.errors.join('\n');
    elements.fields.url.classList.add('is-invalid');
  } else {
    elements.fields.url.classList.remove('is-invalid');
    elements.feedback.classList.remove('text-danger');
  }

  if (state.process === 'success') {
    elements.feedback.classList.add('text-success');
    elements.feedback.textContent = i18nInstance.t('successMessage');
  }

  if (state.feeds.length > 0) {
    const feedCard = document.createElement('div');
    feedCard.classList.add('card', 'border-0');

    const feedCardBody = document.createElement('div');
    feedCardBody.classList.add('card-body');

    const feedCardTitle = document.createElement('h2');
    feedCardTitle.classList.add('card-title', 'h4');
    feedCardTitle.textContent = i18nInstance.t('feedsTitle');
    feedCardBody.appendChild(feedCardTitle);

    feedCard.appendChild(feedCardBody);

    const feedUl = document.createElement('ul');
    feedUl.classList.add('list-group', 'border-0', 'rounded-0');

    state.feeds.forEach((feed) => {
      const feedLi = document.createElement('li');
      feedLi.classList.add('list-group-item', 'border-0', 'border-end-0');

      const feedH3 = document.createElement('h3');
      feedH3.classList.add('h6', 'm-0');
      feedH3.textContent = feed.title;

      const feedP = document.createElement('p');
      feedP.classList.add('m-0', 'small', 'text-black-50');
      feedP.textContent = feed.description;

      feedLi.appendChild(feedH3);
      feedLi.appendChild(feedP);

      feedUl.appendChild(feedLi);
    });

    feedCard.appendChild(feedUl);

    elements.feeds.appendChild(feedCard);
  }

  if (state.posts.length > 0) {
    const postCard = document.createElement('div');
    postCard.classList.add('card', 'border-0');

    const postCardBody = document.createElement('div');
    postCardBody.classList.add('card-body');

    const postCardTitle = document.createElement('h2');
    postCardTitle.classList.add('card-title', 'h4');
    postCardTitle.textContent = i18nInstance.t('postsTitle');
    postCardBody.appendChild(postCardTitle);

    postCard.appendChild(postCardBody);

    const postsUl = document.createElement('ul');
    postsUl.classList.add('list-group', 'border-0', 'rounded-0');

    const sortedPosts = state.posts.sort(
      (post1, post2) => post2.pubDate - post1.pubDate,
    );
    sortedPosts.forEach((post) => {
      const postLi = document.createElement('li');
      postLi.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
        'border-0',
        'border-end-0',
      );

      const postA = document.createElement('a');
      postA.classList.add(
        state.unreadPosts.includes(post.id) ? 'fw-bold' : 'fw-normal',
      );
      postA.setAttribute('href', post.link);
      postA.setAttribute('data-id', post.id);
      postA.setAttribute('target', '_blank');
      postA.setAttribute('rel', 'noopener noreferrer');
      postA.textContent = post.title;

      const postButton = document.createElement('button');
      postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      postButton.setAttribute('type', 'button');
      postButton.setAttribute('data-id', post.id);
      postButton.setAttribute('data-bs-toggle', 'modal');
      postButton.setAttribute('data-bs-target', '#modal');
      postButton.textContent = i18nInstance.t('postButton');
      postButton.addEventListener('click', (e) => {
        const postId = e.target.dataset.id;
        const post = state.posts.find((item) => item.id === postId);

        state.unreadPosts = state.unreadPosts.filter((item) => item !== postId);
        const postA = document.querySelector(`a[data-id=${postId}]`);
        postA.classList.remove('fw-bold');
        postA.classList.add('fw-normal');

        elements.modal.title.textContent = post.title;
        elements.modal.body.textContent = post.description;
      });

      postLi.appendChild(postA);
      postLi.appendChild(postButton);

      postsUl.appendChild(postLi);
    });

    postCard.appendChild(postsUl);
    elements.posts.appendChild(postCard);
  }

  const active = elements.languageSelection.querySelector('.active');
  active.classList.remove('active');
  const current = elements.languageSelection.querySelector(
    `[data-lng="${state.lng}"]`,
  );
  current.classList.add('active');

  i18nInstance.changeLanguage(state.lng).then(() => {
    document.title = i18nInstance.t('title');
    elements.title.textContent = i18nInstance.t('title');
    elements.lead.textContent = i18nInstance.t('lead');
    elements.fields.url.placeholder = i18nInstance.t('input.placeholder');
    elements.label.textContent = i18nInstance.t('input.label');
    elements.submitButton.textContent = i18nInstance.t('button');
    elements.example.textContent = i18nInstance.t('example');
    elements.createdBy.textContent = i18nInstance.t('created by');
    elements.author.textContent = i18nInstance.t('author');
    elements.modal.btnRead.textContent = i18nInstance.t('modal.btnRead');
    elements.modal.btnClose.textContent = i18nInstance.t('modal.btnClose');
    if (elements.feeds.querySelector('.card-title')) {
      elements.feeds.querySelector('.card-title').textContent =
        i18nInstance.t('feedsTitle');
    }
    if (elements.posts.querySelector('.card-title')) {
      elements.posts.querySelector('.card-title').textContent =
        i18nInstance.t('postsTitle');
    }

    if (state.process === 'success') {
      elements.feedback.textContent = i18nInstance.t('successMessage');
    }

    const postButtons = document.querySelectorAll('.posts .btn');
    postButtons.forEach((btn) => {
      btn.textContent = i18nInstance.t('postButton');
    });
  });
};

export default (elements, state, i18nInstance) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'process':
      case 'lng':
      case 'posts': {
        render(elements, state, i18nInstance);
        break;
      }
      default:
        break;
    }
  });
  return watchedState;
};
