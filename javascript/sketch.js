function setup()
{
    app = new App();

    let canvas = createCanvas(550, 550);
    canvas.parent("sketchBoard");
}

function draw()
{
    background(255); 

    for (var i = 0; i < 81; i++)
    {
        app.cells.cell[i].show();
    }

    if (app.solve == true)
    {
        app.solution.solve();
    }

    // Draw the larger cells
    for (var i = 0; i < 3; i++)
    {
        for (var j = 0; j < 3; j++)
        {
            LargeCell(j, i);
        }
    }
}

function LargeCell(x, y)
{
    noFill();
    strokeWeight(2);
    stroke("#344861");
    rect(x * 180 + 1, y * 180 + 1, 180, 180);
}

function Cell(x, y, num)
{
    this.x = x;
    this.y = y;
    this.i = (x/60 + 1) + 9 * (y/60) - 1;
    this.num = num;

    this.show = function()
    {
        noFill();
        strokeWeight(1);
        stroke("#BEC6D4");
        rect(this.x + 1, this.y + 1, 60, 60);
        fill(0);
        textSize(20);
        text(this.num, this.x + 25, this.y + 35);
    }
}