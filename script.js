const burger = document.querySelector('.burger');
const sideMenu = document.querySelector('.side-menu');
const overlay = document.querySelector('.overlay');

const textarea = document.querySelector('textarea');
const preview = document.querySelector('.preview');

const themeButton = document.querySelector('.theme-button');
const themeMenu = document.querySelector('.theme-menu');
const themeOptions = document.querySelectorAll('.theme-option');
const sideThemeOptions = document.querySelectorAll('.side-theme-option');

const themeButtonIcon = themeButton.querySelector('.material-icons.theme-icon');

const openButtons = document.querySelectorAll('.icon-text-button[title="Open"], .side-icon-text-button[title="Open"]');

function toggleMenu() {
    sideMenu.classList.toggle('open');
    overlay.style.display = sideMenu.classList.contains('open') ? 'block' : 'none';
}

burger.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

const savedMarkdown = localStorage.getItem('markdown-content') || '';
textarea.value = savedMarkdown;
preview.innerHTML = marked.parse(savedMarkdown);

textarea.addEventListener('input', () => {
    const markdownText = textarea.value;
    preview.innerHTML = marked.parse(markdownText);
    localStorage.setItem('markdown-content', markdownText);
});

function applyTheme(theme) {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');

    let currentThemeIsDark = false;

    if (theme === 'system') {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-theme');
            currentThemeIsDark = true;
        }
        localStorage.removeItem('theme');
    } else if (theme === 'dark') {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        currentThemeIsDark = true;
    } else {
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
        currentThemeIsDark = false;
    }

    if (themeButtonIcon) {
        themeButtonIcon.textContent = currentThemeIsDark ? 'dark_mode' : 'light_mode';
    }

    if (sideMenu.classList.contains('open')) {
        toggleMenu();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme('system');
    }
});

themeButton.addEventListener('click', (event) => {
    event.stopPropagation();
    themeMenu.classList.toggle('open');
});

document.addEventListener('click', (event) => {
    if (themeMenu.classList.contains('open') && !themeMenu.contains(event.target) && !themeButton.contains(event.target)) {
        themeMenu.classList.remove('open');
    }
});

themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        const selectedTheme = option.dataset.theme;
        applyTheme(selectedTheme);
        themeMenu.classList.remove('open');
    });
});

sideThemeOptions.forEach(option => {
    option.addEventListener('click', () => {
        const selectedTheme = option.dataset.theme;
        applyTheme(selectedTheme);
    });
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (!localStorage.getItem('theme')) {
        applyTheme('system');
    }
});

function openFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md';

    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                textarea.value = e.target.result;
                preview.innerHTML = marked.parse(e.target.result);
                localStorage.setItem('markdown-content', e.target.result);
                if (sideMenu.classList.contains('open')) {
                    toggleMenu();
                }
            };
            reader.onerror = () => {
                alert('Failed to read file.');
            };
            reader.readAsText(file);
        }
    });

    input.click();
}

openButtons.forEach(button => {
    button.addEventListener('click', openFile);
});

document.querySelectorAll('a').forEach(a => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
});
