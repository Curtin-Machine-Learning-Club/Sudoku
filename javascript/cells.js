/**
 * Contains the class the represents the view of the board
 */
class Cells
{
    constructor()
    {
        this.cell = [];

        for (var i = 0; i < 9; i++)
        {
            for (var j = 0; j < 9; j++)
            {
                var index = (j) + 9 * (i);
                
                this.cell[index] = new Cell(j * 60, i * 60, 0);
            }
        }
    }

    setCells(board)
    {
       for (var i = 0; i < 81; i++) 
       {
           this.cell[i].num = board.charAt(i);
       }
    }

    setCell(index, value)
    {
        this.cell[index].num = value;
    }


}