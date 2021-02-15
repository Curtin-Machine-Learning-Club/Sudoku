/**
 * class : App
 * Contains the main controller for the sudoku solver
 */
class App
{
    constructor() 
    {
        this.sudoku = new Sudoku();
        this.cells = new Cells();
        this.solution = (new SolutionFactory(this, this.sudoku)).makeSolution();
        this.solve = false;

        this.init();
    }

    init()
    {
        this.setUp();

        /*
        Assigns the generate function to the generate button
        */
        document.getElementById("generate-button").onclick = function()
        {
            var board;

            app.solve = false;
            board = app.sudoku.generate(26);
            app.initCells(board);
            app.solution.reset();
        };

        /*
            Assigns the solve function to the function buttton
        */
        document.getElementById("solve-button").onclick = function()
        {
            if (app.solve = false)
            {
                app.solution.reset();
            }
            app.solve = true;
        };
    }

    initCells(board)
    {
        this.cells.setCells(board);
    }

    setUp()
    {
        var board;

        board = this.sudoku.generate(26);
        this.initCells(board);
        this.solution.reset();
    }

    replaceAt(string, index, value)
    {
        var output = "";

        if (index >= string.length)
        {
            output = string.valueOf();
        }

        output = string.substring(0, index) + value + string.substring(index + 1);

        return output;
    }


    setCellNumber(index, number)
    {
        this.cells.cell[index].num = number;
    }

    getCell(index)
    {
        return this.cells.cell[index];
    }

    getBoard()
    {
        var output = "";

        for (var i = 0; i < 81; i++)
        {
            output += this.getCell(i).num;
        }

        return output;
    }

    getCandidateMap()
    {
        return this.sudoku._get_candidates_map(this.getBoard());
    }
    
}