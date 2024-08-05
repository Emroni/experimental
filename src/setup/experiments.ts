import _ from 'lodash';

const items: [string, string, boolean?, boolean?][] = [
    ['animal/1', '2019-11-10', false, true],
    ['animal/2', '2019-12-05', false, true],
    ['arcs', '2018-04-14', false, true],
    ['art/1', '2019-10-28', false, true],
    ['cubes', '2018-06-02', false, true],
    ['cubic/1', '2019-08-20'],
    ['cubic/2', '2019-08-20'],
    ['cubic/3', '2019-08-20'],
    ['cubic/4', '2019-09-27', false, true],
    ['cubic/5', '2019-10-07', false, true],
    ['cubic/6', '2019-10-10', false, true],
    ['cubic/7', '2019-10-15', false, true],
    ['drops', '2017-06-02', false, true],
    ['duality', '2019-05-20', true],
    ['eye/1', '2019-08-23', false, true],
    ['eye/2', '2019-08-23', false, true],
    ['eye/3', '2019-09-10', false, true],
    ['face', '2018-03-27', false, true],
    ['flocking/1', '2019-08-21', false, true],
    ['flocking/2', '2019-08-21', false, true],
    ['flocking/3', '2019-08-23', false, true],
    ['foggy-forest', '2018-03-31', false, true],
    ['followers', '2018-06-03', false, true],
    ['hexagon/1', '2019-08-11'],
    ['hexagon/2', '2019-08-11'],
    ['hexagon/3', '2019-08-11'],
    ['hexagon/4', '2019-08-11'],
    ['hexagon/5', '2019-08-11'],
    ['kaleidoscope/1', '2019-08-18', false, true],
    ['kaleidoscope/2', '2019-08-18', false, true],
    ['kaleidoscope/3', '2019-08-18', false, true],
    ['mobius', '2017-06-01', false, true],
    ['morph', '2017-10-31', false, true],
    ['mother-box', '2017-12-04', false, true],
    ['nebula', '2017-10-30', false, true],
    ['pixeliser', '2018-04-14', false, true],
    ['plotter/1', '2019-09-17', false, true],
    ['plotter/2', '2019-09-18', false, true],
    ['polyhedron/1', '2019-08-14'],
    ['polyhedron/2', '2019-08-14'],
    ['rings', '2018-06-21', false, true],
    ['ripples', '2017-06-07', false, true],
    ['simplex-noise/1', '2019-08-09'],
    ['simplex-noise/2', '2019-08-11'],
    ['solar', '2018-04-02', false, true],
    ['sphere/1', '2019-08-13'],
    ['sphere/2', '2019-08-13'],
    ['sphere/3', '2020-01-30', false, true],
    ['tau', '2018-06-15', false, true],
    ['tree-of-thoughts', '2017-11-01', false, true],
    ['trigonometry', '2017-08-08', false, true],
    ['tunnel/1', '2019-08-19', false, true],
    ['tunnel/2', '2019-08-19', false, true],
    ['tunnel/3', '2019-09-29', false, true],
    ['wander-lost', '2019-05-28', false, true],
    ['wave/1', '2019-08-21', false, true],
    ['wave/2', '2019-10-04', false, true],
    ['wave/3', '2019-11-09', false, true],
    ['worlds-end', '2018-02-22', false, true],
];

items.sort((a, b) => a[1] < b[1] ? 1 : -1);

export const experiments: Experiment[] = items.map(([name, date, featured, disabled], index) => ({
    date,
    disabled,
    featured,
    image: `/assets/images/${name.replace('/', '-')}.png`,
    index: (items.length - index).toString().padStart(3, '0'),
    path: `/${name}`,
    title: _.startCase(name),
}));