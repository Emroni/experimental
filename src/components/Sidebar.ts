import experiments from '@/experiments';

let items: SidebarItem[];

window.addEventListener('load', () => {
    // Get elements 
    const list = document.getElementById('sidebar-list');
    const itemTemplate = document.getElementById('sidebar-item-template');

    // Reset elements
    list.innerHTML = '';
    itemTemplate.removeAttribute('id');

    // Generate items
    items = Object.keys(experiments).map(name => {
        const url = `/${name}`;

        // Clone element
        const element = itemTemplate.cloneNode(true) as HTMLLIElement;
        list.appendChild(element);

        // Update anchor
        const anchor = element.querySelector('a');
        anchor.innerHTML = name.replace('/', ' / ');
        anchor.setAttribute('href', url);
        anchor.addEventListener('click', e => {
            e.preventDefault();
            window.history.pushState({}, '', url);
            const popStateEvent = new PopStateEvent('popstate', { state: {} });
            window.dispatchEvent(popStateEvent);
        });

        // Return item
        return {
            anchor,
            element,
            url,
        };
    });

    window.addEventListener('popstate', updateItems);
    updateItems();
});

function updateItems() {
    items.forEach(item => {
        const active = window.location.pathname === item.url;
        item.anchor.classList.toggle('hover:bg-slate-600', !active);
        item.anchor.classList.toggle('bg-slate-700', active);
        item.anchor.classList.toggle('pointer-events-none', active);
    });
}