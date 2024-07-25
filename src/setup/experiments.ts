import _ from 'lodash';

const items = [
    'simplex-noise/1',
    'simplex-noise/2',
    'hexagon/1',
    'hexagon/2',
    'hexagon/3',
    'hexagon/4',
    'hexagon/5',
    'sphere/1',
    'sphere/2',
    'polyhedron/1',
    'polyhedron/2',
    'kaleidoscope/1',
    'kaleidoscope/2',
    'kaleidoscope/3',
    'tunnel/1',
    'tunnel/2',
    'cubic/1',
    'cubic/2',
    'cubic/3',
    'wave/1',
    'flocking/1',
    'flocking/2',
    'flocking/3',
    'eye/1',
    'eye/2',
    'eye/3',
    'plotter/1',
    'plotter/2',
    'cubic/4',
    'tunnel/3',
    'wave/2',
    'cubic/5',
    'cubic/6',
    'cubic/7',
    'art/1',
    'wave/3',
    'animal/1',
    'animal/2',
    'sphere/3',
];
items.reverse();

const enabled = [
    'cubic/1',
    'cubic/2',
    'cubic/3',
];

export const experiments: Experiment[] = items.map((item, index) => ({
    disabled: !enabled.includes(item),
    image: `/assets/images/${item.replace('/', '-')}.png`,
    index: (items.length - index).toString().padStart(3, '0'),
    path: `/${item}`,
    title: _.startCase(item),
}));