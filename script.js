// Set dimensions
const width = 960;
const height = 600;
const legendWidth = 500;
const legendHeight = 150;

// Create SVG
const svg = d3.select('#tree-map')
    .attr('width', width)
    .attr('height', height);

// Color scale
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Create legend SVG
const legendSvg = d3.select('#legend')
    .append('svg')
    .attr('width', legendWidth)
    .attr('height', legendHeight);

// Load data
d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json')
  .then(data => {
    // Create hierarchy
    const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    // Create treemap layout
    const treemap = d3.treemap()
      .size([width, height])
      .padding(1);

    treemap(root);

    // Get categories for legend
    const categories = root.children.map(d => d.data.name);

    // Create cells
    const cell = svg.selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    // Add rectangles
    cell.append('rect')
      .attr('class', 'tile')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('data-name', d => d.data.name)
      .attr('data-category', d => d.data.category)
      .attr('data-value', d => d.data.value)
      .attr('fill', d => colorScale(d.data.category))
      .on('mousemove', function(event, d) {
        const tooltip = d3.select('#tooltip');
        tooltip
          .style('opacity', 0.9)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px')
          .attr('data-value', d.data.value)
          .html(`
            Name: ${d.data.name}<br>
            Category: ${d.data.category}<br>
            Value: $${d.data.value.toLocaleString()}
          `);
      })
      .on('mouseout', function() {
        d3.select('#tooltip').style('opacity', 0);
      });

    // Add text labels
    cell.append('text')
      .selectAll('tspan')
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append('tspan')
      .attr('x', 4)
      .attr('y', (d, i) => 13 + i * 10)
      .text(d => d)
      .attr('font-size', '8px')
      .attr('fill', 'black');

    // Create legend
    const legend = legendSvg.selectAll('g')
      .data(categories)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${Math.floor(i / 3) * 160}, ${(i % 3) * 20 + 10})`);

    // Add legend rectangles
    legend.append('rect')
      .attr('class', 'legend-item')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', d => colorScale(d));

    // Add legend text
    legend.append('text')
      .attr('x', 20)
      .attr('y', 12.5)
      .text(d => d);
  })
  .catch(error => console.error('Error loading data:', error));
