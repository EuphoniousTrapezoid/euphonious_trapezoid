# Sphero

At the beginning of the game, the play
space contains a centered black sphere
called the anchor.

Four other spheres can be attached to the
anchor.

Each sphere that has been placed on the board
can be attached to four other spheres.

Let a *liberty* be any spot on the board where
a new sphere could be attached to a placed sphere.

Let the *valence* of a sphere be the minimum number of horizontal or vertical steps from the anchor to that sphere.

Illustrated below are a few game states. Consider 'A' to be the anchor, 'S' to be a sphere, and 'L' to be a liberty:

## Example 1

      L
    L A L
      L

## Example 2

      L L 
    L A S L
      L L

## Example 3

        L
      L S L
      L S S L
      L S S S L
    L S A S S S L
      L L L L L

A board can be either *balanced* or
*unbalanced*.

A board is balanced if the valence of the sphere
with the highest valence on the board, which
will be referred to as the *highest valence* hereon, is no more than 3 larger than the valence of the sphere, out of all spheres attached to only one other sphere, with the lowest valence. If at least 1 of the liberties
initially associated with the anchor is still a liberty for some board, then that board is unbalanced if the highest valence is greater than 3.

A board in unbalanced if it is not balanced.

Examples 1-3 are examples of game states with
balanced boards. 

Illustrated below are examples of game states
with unbalanced boards. Note that, for the
sake of simplicity, the game states below imply
the liberties:

## Example 4

            S
    S S S S A S

## Example 5

      S
      S S   S
      S S S S
    S A S S S
      S

As soon as a board becomes unbalanced, the
board reconfigures to a balanced state.

## Example 6

    Unbalanced:

    S
    A S S S S

    Rebalanced:

    S S A S S
        S

## Example 7

    Unbalanced:

      S S
    S   S
    S   S S S
    S S A S S S
        S     S S
    S S S
      S S S
        S

    Rebalanced:

          S
          S
        S S S
          S
    S S S A S S S
    S S S S   S S
        S S S
          S S

What follows is the algorithm used
to rebalance the board.

1. Isolate a sub-board of all the
spheres on the board whose valence
is less than 1 less than the highest
valence.

2. Rotate this sub-board by 180 degrees.

3. For every other sphere on the board, that is for all spheres on the board whose valence is greater than or equal to 1 less than the highest valence, in an order determined primarily by the sphere's valence and secondarily by the sphere's clockwise angular distance from the vertical direction above the board's anchor, move the sphere to the closest liberty towards the center. Note that if, for one such sphere, the two closest liberties are identically close, the choice is made in the clockwise direction.

For the illustration below, consider 'U' to be some sphere that did not make the subselection of step 1:

## Example 8

    Unbalanced:

            S
    S S S S A S

    Step 1:

            S
    U U S S A S

    Step 2:

    U U   S A S S
            S

    Step 3.1:

    U   S S A S S
            S

    Step 3.2:

      S S S A S S
            S

Each player is associated to a color.

At any point after the game has started, any
player can place a sphere of his/her color on any of the board's liberties. If, for some game state, there exists a chain of 5 spheres of the same color, those 5 sphere will get removed from the board. After removing those 5 spheres from the board, the following algorithm is executed:

1. Isolate the sub-board of all the spheres on the board that are not, directly or indirectly, attached to the board's anchor.

2. For every sphere in this sub-board, in an order determined primarily by the sphere's valence and secondarily by the sphere's clockwise angular distance from the vertical direction above the board's anchor, move the sphere to the closest liberty of a sphere that is attached to the anchor. Note that if the two closest liberties are identically close, the choice is made in the clockwise direction.

3. If necessary, rebalance the resulting board.

For the illustration below, consider 'Y' to be a yellow sphere, 'R' to be a red sphere, 'B' to be a brown sphere, and 'G' to be a green sphere. Moreover, consider 'y', 'r', 'b' and 'g' to be selected spheres:

## Example 9

        B G
      B Y Y R
    R A Y Y Y
    R Y B G

    Remove the chain of five 'Y'

        B G
      B     R
    R A
    R Y B G

    Step 1:

        b g
      B     r
    R A
    R Y B G

    Step 2.1:

          g
      B B   r
    R A
    R Y B G

    Step 2.2:

      B B G r
    R A
    R Y B G

    Step 2.3:

      B B G
    R A
    R Y B G R

    Step 3:

    B Y R
      A R G
    B B G R

The game ends when the highest valence exceeds 20. The player with the most pieces of his/her color on the board at the end of the game wins.