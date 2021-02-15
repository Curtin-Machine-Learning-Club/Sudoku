class SolutionFactory
{
    constructor(app, sudoku)
    {
        this.app = app;
        this.sudoku = sudoku;
    }

    makeSolution()
    {
        var title = "Sudoku Solver | ";
        var output = new Search(this.app); 

        if (document.title == (title + "Backtracking"))
        {
            output = new Backtracking(this.app);    
        }


        return output;
    }
}
