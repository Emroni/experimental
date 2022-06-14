import experiments from '@/experiments';

window.addEventListener('load', () => {
    // Get elements
    const list = document.getElementById('sidebar-list');
    const itemTemplate = document.getElementById('sidebar-item-template');

    // Reset elements
    list.innerHTML = '';
    itemTemplate.removeAttribute('id');

    // Generate items
    const names = Object.keys(experiments);
    names.forEach((name, index) => {
        const url = `/${name}`;

        // Clone element
        const element = itemTemplate.cloneNode(true) as HTMLLIElement;
        list.appendChild(element);

        // Update anchor
        const anchor = element.querySelector('a');
        anchor.setAttribute('href', url);

        const content = anchor.querySelectorAll('span');
        content[0].innerHTML = (names.length - index).toString().padStart(3, '0');
        content[1].innerHTML = name.replace('/', ' / ');

        const active = window.location.pathname === url;
        anchor.classList.toggle('hover:bg-slate-600', !active);
        anchor.classList.toggle('bg-slate-700', active);
        anchor.classList.toggle('pointer-events-none', active);
    });
});
