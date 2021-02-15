/**
 * Reference : https://github.com/robatron/sudoku.js/ 
 * Code from that source has been rewritten to fit use
 */
class Search
{
    constructor(app)
    {
        this.app = app;

        this.initialize();
    }

    initialize()
    {
        // Set up for constants
        this.DIGITS = "123456789";    // Allowed sudoku.DIGITS
        this.ROWS = "ABCDEFGHI";         // Row lables
        this.COLS = this.DIGITS;       // Column lables
        this.SQUARES = null;             // Square IDs

        this.UNITS = null;               // All units (row, column, or box)
        this.SQUARE_UNITS_MAP = null;    // Squares -> units map
        this.SQUARE_PEERS_MAP = null;    // Squares -> peers map
        
        this.MIN_GIVENS = 17;            // Minimum number of givens 
        this.CELLS = 81;            // Number of squares

    }

    // Set's up the algorithms data structures
    setup()
    {
        // Get the board from the app
        var board = this.app.getBoard();

        // Initialise all constants and fields using the sudoku library
        this.app.sudoku.initialize(this);

        // Validate the board
        this.givens = 0;
        for(var i in board)
        {
            if(board[i] !== this.BLANK_CHAR && this._in(board[i], this.DIGITS))
            {
                ++this.givens;
            }
        }
        if(this.givens < this.MIN_GIVENS)
        {
            throw "Too few givens. Minimum givens is " + this.MIN_GIVENS;
        }

        // Set the candidates map from the app (app get's it from the sudoku library)
        this.candidates = this.app.getCandidateMap();

        // Stack to emulate the call stack
        this.stack = [];
        var candidatesCopy = JSON.parse(JSON.stringify(this.candidates));
        this.stack.push(candidatesCopy)
    }

    // Runs the algorithm step by step instead of recursively
    solve()
    {
        var solution;

        // Gets the map of square to potential digits
        this.candidates = this.app.getCandidateMap();

        // Searches through to find what to eliminate
        this._search();

        // Put square values that only have one value
        var completedSquares = 0;
        for (var i = 0; i < this.SQUARES.length; i++)
        {
            var square = this.SQUARES[i];

            if (this.candidates[square].length === 1)
            {
                this.app.setCellNumber(i, this.candidates[square]);
                completedSquares++;
            }
        }

        if (completedSquares == 81)
        {
            this.app.solve = false;
        }
    }

    // Resets all values
    reset()
    {
        // Calls the set up again
        this.setup();
    }

    // Returns the true if value is in sequence
    _in(value, sequence)
    {
        return sequence.indexOf(value) !== -1;
    }

    // Searches through the candidates to find the things to eliminate
    // through assigning values to certain squares
    _search()
    {
        // Check if the stack isn't empty
        if (this.stack.length > 0)
        {
            // Keep pulling from the stack until a valid candidates
            do
            {
                var potentialCandidates = this.stack.pop();

                if (potentialCandidates)
                {
                    this.candidates = potentialCandidates;
                }

            } while (!potentialCandidates);

            var maxCandidates = 0;
            var maxCandidatesSquare = null;

            // Search through each square for the maximum number of candidates
            for(var si in this.SQUARES)
            {
                var square = this.SQUARES[si];
                
                var numCandidates = this.candidates[square].length;
                    
                if(numCandidates > maxCandidates)
                {
                    maxCandidates = numCandidates;
                    maxCandidatesSquare = square;
                }
            }

            // If the max candidates is 1, every position only has one potential
            // value hence the board has been solved, so return the board
            if (maxCandidates !== 1)
            {
                // Choose the blank square with the fewest possibilities > 1
                var minCandidates = 10;
                var minCandidatesSquare = null;

                // Go through to find square with lowest candidate number
                for(si in this.SQUARES)
                {
                    var square = this.SQUARES[si];
                    
                    var numCandidates = this.candidates[square].length;
                    
                    if(numCandidates < minCandidates && numCandidates > 1)
                    {
                        minCandidates = numCandidates;
                        minCandidatesSquare = square;
                    }
                }

                var minCandidates = this.candidates[minCandidatesSquare];
                var done = false;

                // Use that smallest candidate square to assign values to that square
                // Which then causes nearby squares to have the value eliminated from them
                for(var vi in minCandidates)
                {
                    if (!done)
                    {
                        var val = minCandidates[vi];
                        
                        // Copites the candidates the pushes next iteration candidates
                        var candidatesCopy = JSON.parse(JSON.stringify(this.candidates));
                        this.stack.push(this._assign(candidatesCopy, minCandidatesSquare, val));
                    }
                }
            }
            else
            {
                // Has been solved
                this.app.solve = false;
            }
        }
        else
        {
            // Has been solved 
            this.app.solve = false;
        }
    }

    /**
     * Assigns a value to a square and then eliminates that 
     * from all nearby squares
     */
    _assign(candidates, square, val)
    {
        // Get candidate list not including val
        var otherVals = candidates[square].replace(val, "");

        var candidatesNext = candidates;

        // Loop through each value and eliminate them, then propigate
        // if a contridiction then return false
        var done = false;
        for(var ovi in otherVals)
        {
            if (!done)
            {
                var otherVal = otherVals[ovi];

                var candidatesNext =
                    this._eliminate(candidates, square, otherVal);
                
                if(!candidatesNext)
                {
                    candidatesNext = false;
                    done = true;
                }
            }
        }

        return candidatesNext;
    }

    /**
     * Eliminates the value from all nearby squares
     */
    _eliminate(candidates, square, val)
    {
        var candidatesNext = candidates;

        // If already eliminated return with current candidates
        if (this._in(val, candidates[square]))
        {
            // Remove `val` from candidates[square]
            candidates[square] = candidates[square].replace(val, '');
            
            // If the square has only candidate left, eliminate that value from its 
            // peers
            var numCandidates = candidates[square].length;
            if(numCandidates === 1)
            {
                var targetVal = candidates[square];
                
                var done = false;
                for(var pi = 0; pi < this.SQUARE_PEERS_MAP[square].length && !done; pi++)
                {
                    var peer = this.SQUARE_PEERS_MAP[square][pi];
                    
                    var candidatesNew = 
                            this._eliminate(candidates, peer, targetVal);
                            
                    if(!candidatesNew)
                    {
                        candidatesNext = false;
                        done = true;
                    }
                }
            }
            else if (numCandidates === 0)
            {
                candidatesNext = false;
            }
            // If not 0 or output not already false continue
            else if (candidatesNext != false)
            {
                var done = false;
                for (var ui = 0; ui < this.SQUARE_UNITS_MAP[square].length && !done; ui++)
                {
                    var unit = this.SQUARE_UNITS_MAP[square][ui];
                    
                    var val_places = [];
                    for(var si in unit)
                    {
                        var unit_square = unit[si];
                        if(this._in(val, candidates[unit_square]))
                        {
                            val_places.push(unit_square);
                        }
                    }
                        
                    // If there's no place for this value, we have a contradition!
                    // return false
                    if(val_places.length === 0)
                    {
                        done = true;
                        candidatesNext = false;
                    }
                    // Otherwise the value can only be in one place. Assign it there.
                    else if(val_places.length === 1)
                    {
                        var candidatesNew = 
                            this._assign(candidates, val_places[0], val);
                        
                        if(!candidatesNew)
                        {
                            done = true;
                            candidatesNext = false;;
                        }
                    }
                }
            }
        }
        
        return candidatesNext;
    }
}