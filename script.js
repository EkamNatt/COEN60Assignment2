const activities = [
    { name: 'sleep', color: 'grey' },
    { name: 'study', color: 'blue' },
    { name: 'play', color: 'green' },
    { name: 'exercise', color: 'purple' },
    { name: 'social', color: 'yellow' },
    { name: 'eat', color: 'orange' }
];

const weeklySchedule = {
    'Sunday': { 'gym': 1, 'chore': 2, 'research': 8, 'eat+social': 6, 'in-transit': 1, 'sleep': 6 },
    'Monday': { 'meeting': 2, 'class': 3, 'research': 8, 'tennis': 1, 'eat': 1, 'social': 1, 'in-transit': 1, 'sleep': 7 },
    // ... add other days as per your example
};

const width = 800;
const height = 300;
const svg = d3.select("#schedule").append("svg").attr("width", width).attr("height", height);
const totalHours = 24;
const scaleX = d3.scaleLinear().domain([0, totalHours]).range([0, width]);
const barHeight = height / Object.keys(weeklySchedule).length;

let yOffset = 0;

Object.keys(weeklySchedule).forEach((day, dayIndex) => {
    let xOffset = 0;

    Object.entries(weeklySchedule[day]).forEach(([activity, hours]) => {
        const color = activities.find(a => a.name === activity)?.color || 'black';
        const rect = svg.append('rect')
            .attr('x', xOffset)
            .attr('y', yOffset)
            .attr('width', scaleX(hours))
            .attr('height', barHeight - 1)
            .attr('fill', color)
            .attr('class', 'activity-bar');

        rect.on('mouseover', function() {
            d3.select(this).attr('fill-opacity', 0.5);
            svg.append('text')
                .attr('id', 'tooltip')
                .attr('x', xOffset + 5)
                .attr('y', yOffset + 15)
                .text(`${activity}: ${hours} hours`)
                .attr('font-size', '12px');
        });

        rect.on('mouseout', function() {
            d3.select(this).attr('fill-opacity', 1);
            d3.select('#tooltip').remove();
        });
        
        xOffset += scaleX(hours);
    });

    svg.append('text')
        .attr('x', 5)
        .attr('y', yOffset + 15)
        .text(day)
        .attr('font-size', '12px')
        .attr('font-weight', 'bold');

    yOffset += barHeight;
});

let activityTotals = {};

Object.keys(weeklySchedule).forEach(day => {
    Object.entries(weeklySchedule[day]).forEach(([activity, hours]) => {
        if (!activityTotals[activity]) {
            activityTotals[activity] = 0;
        }
        activityTotals[activity] += hours;
    });
});

let activityAverages = {};

Object.keys(activityTotals).forEach(activity => {
    activityAverages[activity] = activityTotals[activity] / 7;
});

const statsSvg = d3.select("#statistics").append("svg").attr("width", width).attr("height", 200);
const scaleY = d3.scaleLinear().domain([0, d3.max(Object.values(activityAverages))]).range([0, 150]);

let statsXOffset = 0;
const statsBarWidth = width / Object.keys(activityAverages).length;

Object.entries(activityAverages).forEach(([activity, average]) => {
    const color = activities.find(a => a.name === activity)?.color || 'black';
    statsSvg.append('rect')
        .attr('x', statsXOffset)
        .attr('y', 150 - scaleY(average))
        .attr('width', statsBarWidth - 5)
        .attr('height', scaleY(average))
        .attr('fill', color)
        .attr('class', 'activity-bar');

    statsSvg.append('text')
        .attr('x', statsXOffset + 5)
        .attr('y', 165)
        .text(activity)
        .attr('font-size', '10px');

    statsSvg.append('text')
        .attr('x', statsXOffset + 5)
        .attr('y', 
