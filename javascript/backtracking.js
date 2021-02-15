/**
 * Contains the backtracking algorithm for solving sudoku
 * 
 * Reference: https://editor.p5js.org/jnsjknn/sketches/RjtKXQ8hY
 * Code based of the reference and rewritten
 */
class Backtracking
{
    // Gives pointer to app as well as initialising algorithm
    constructor(app)
    {
        this.app = app;
        this.stack = [];
        this.current = this.app.getCell(0);
        this.number = 1;
    }

    // Resets variables from last time the solve button was pressed
    reset()
    {
        this.stack = [];
        this.current = this.app.getCell(0);
        this.number = 1;
    }
    
    // Wrapper for the backtracking algorithm
    solve()
    {
        // If the current cell is empty
        if (this.current.num == " ")
        {
            // If the current position is possible with the number
            if (this.possible() && this.number < 10)
            {
                // Assign the number 
                if (this.number == 0)
                {
                    this.current.num = " ";
                }
                else
                {
                    this.current.num = this.number;
                }
                // Then push the current position to the stack for later
                this.stack.push(this.current);
                
                // Reset the number to use
                this.number = 0;

                // If in bounds then change the cells value
                if (this.current.i < 80)
                {
                    this.current = this.app.getCell(int(this.current.i)+1);
                }
                // Otherwise it has been solved
                else
                {
                    this.app.solve = false;
                    alert("solved.");
                }

            }
            // If not possible to put number in the current positon
            else
            {
                // If number is 9
                if (this.number > 8)
                {
                    // Reset the number in the cell to 0
                    this.current.num = " ";
                    // Change current to the last thing on the stack
                    this.current = this.stack.pop();

                    // Then set number to the number in the current cell
                    if (this.current.num == " ")
                    {
                        this.number = 0;
                    }
                    else
                    {
                        this.number = int(this.current.num);
                    }

                    // Then set the current cells number to 0
                    this.current.num = " ";
                }
            }
        }
        // If current cell is not empty
        else
        {
            // If the cell is not the 80th then change to the next cell
            if (this.current.i < 80)
            {
                this.current = this.app.getCell(int(this.current.i)+1);
            }
            // Otherwise the board has been solved
            else
            {
                this.app.solve = false;
                alert("solved.");
            }

            this.number = 0;
        }
        // Increment the number for the next iteration
        this.number++;
    }

    // Validates the value in it's position
    possible()
    {
        var output = true;

        // Check that the number does not have any horizontal conflicts
        for (var ii = 0; ii < 9; ii++)
        {
            let k = (ii) + 9 * (this.current.y / 60);

            if (this.app.getCell(k).num == this.number)
            {
                output = false;
            }
        }

        // Check that the number does not have any vertical conflicts
        for (var jj = 0; jj < 9; jj++)
        {
            let k = (this.current.x / 60) + 9 * (jj);

            if (this.app.getCell(k).num == this.number)
            {
                output = false;
            }
        }

        // Set x0 and y0 to the corner of the closest 3x3 square
        let x0 = Math.floor(this.current.x / 60 / 3) * 3;
        let y0 = Math.floor(this.current.y / 60 / 3) * 3;

        // Check that the number does not have any conflicts in the 3x3 square
        for (var i = 0; i < 3; i++)
        {
            for (var j = 0; j < 3; j++)
            {
                let k = ((x0+j)) + 9 * (y0+i);

                if (this.app.getCell(k).num == this.number)
                {
                    output = false;
                }
            }
        }
        
        return output;
    };

    // Converts the string board to a grid
    stringToGrid(board)
    {
        var output = [[0, 0, 0, 0, 0 ,0 ,0 ,0 ,0],
                      [0, 0, 0, 0, 0 ,0 ,0 ,0 ,0],
                      [0, 0, 0, 0, 0 ,0 ,0 ,0 ,0],
                      [0, 0, 0, 0, 0 ,0 ,0 ,0 ,0],
                      [0, 0, 0, 0, 0 ,0 ,0 ,0 ,0],
                      [0, 0, 0, 0, 0 ,0 ,0 ,0 ,0],
                      [0, 0, 0, 0, 0 ,0 ,0 ,0 ,0],
                      [0, 0, 0, 0, 0 ,0 ,0 ,0 ,0],
                      [0, 0, 0, 0, 0 ,0 ,0 ,0 ,0]];

        let counter = 0;

        for (var i = 0; i < 9; i++)
        {
            for (var j = 0; j < 9; j++)
            {
                if (board.charAt(counter) != " ")
                {
                    output[i][j] = parseInt(board.charAt(counter));
                }

                counter++;
            }
        }

        return output;
    }

    // Converts the grid board to string
    gridToString(board)
    {
        var output = "";

        for (var i = 0; i < 9; i++)
        {
            for (var j = 0; j < 9; j++)
            {
                if (board[i][j] === 0)
                {
                    output += " ";
                }
                else
                {
                    output += board[i][j];
                }
            }
        }

        return output;
    }
}
