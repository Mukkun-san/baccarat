<script>
  import { game } from "../../stores/sessionStore";

  export let betsList, metrics;
  export let nbrRows, nbrCols, from, to, slice;

  let dataMatrix = [];

  function populateDataMatrix() {
    dataMatrix = [];
    let latestBets = betsList;
    let latestMetrics = metrics;
    const boardSize = nbrCols * nbrRows;
    const nbOfBets = betsList.length;
    // trim data to the latest
    if (nbOfBets > boardSize) {
      let start = nbrRows * Math.round((nbOfBets - boardSize) / nbrRows + 0.49);
      let end = nbOfBets;
      if (slice) {
        start = from;
        end = to;
      }
      latestBets = latestBets.slice(start, end);
      latestMetrics = latestMetrics.slice(start, end);
    }

    for (let i = 0; i < nbrCols; i++) {
      const row = [];
      for (let j = 0; j < nbrRows; j++) {
        const idx = i * nbrRows + j;
        const bet = latestBets[idx];
        const nbr = latestMetrics[idx];
        row.push([bet, nbr]);
      }
      dataMatrix.push(row);
    }
    dataMatrix = mT(dataMatrix);

    const MOD = nbOfBets % nbrRows;
    if (
      MOD === 1 &&
      nbOfBets > boardSize &&
      document.getElementById("cell-1")
    ) {
      highlightedCells.forEach((cell) => {
        const n = +cell.substr(5);
        const newCell = "cell-" + (n - nbrRows);
        if (n > nbrRows) {
          document.getElementById(cell).className = "";
          highlightedCells = highlightedCells.filter((x) => x !== cell);
          document.getElementById(newCell).className = "bg-warning";
          highlightedCells.push(newCell);
        } else {
          document.getElementById(cell).className = "";
          highlightedCells = highlightedCells.filter((x) => x !== cell);
        }
        console.log(highlightedCells);
      });
    }
  }

  // return the transpose of a matrix
  function mT(matrix) {
    return matrix.reduce(
      (x, row) => row.map((_, i) => [...(x[i] || []), row[i]]),
      []
    );
  }

  $: {
    nbrRows = nbrRows;
    nbrCols = nbrCols;
    metrics;
    populateDataMatrix();
  }

  let highlightedCells = [];

  $: {
    console.log(highlightedCells);
  }
</script>

<div>
  {#if !betsList.length}
    <div class="alert alert-warning mx-2">
      <h3 class="text-center text-warning">Game Not Started Yet</h3>
    </div>
  {:else}
    <div class="d-flex flex-wrap justify-content-center">
      <table class="table table-bordered table-dark w-auto">
        <tbody>
          {#each dataMatrix as row, i}
            <tr style="line-height: 20px;">
              {#each row as c, j}
                <td
                  id={"cell-" + (i + 1 + j * nbrRows)}
                  style="min-width:70px;"
                  class=""
                  on:click={(e) => {
                    if (e.target.tagName !== "TD") {
                      return;
                    }
                    const cls = e.target.className;
                    if (!cls) {
                      highlightedCells = [
                        ...highlightedCells,
                        "cell-" + (i + 1 + j * nbrRows),
                      ];
                      e.target.className = "bg-warning";
                    } else {
                      highlightedCells = highlightedCells.filter(
                        (x) => x !== "cell-" + (i + 1 + j * nbrRows)
                      );
                      e.target.className = "";
                    }
                  }}
                >
                  <span> {typeof c[0] !== "undefined" ? c[0] : ""}</span>
                  {#if $game?.type === "combos"}
                    <span />
                  {:else}
                    -
                    <span
                      style="color:{c[1]
                        ? 'green'
                        : c[1] === null
                        ? 'white'
                        : 'red'}"
                    >
                      {typeof c[0] === "undefined"
                        ? ""
                        : c[1]
                        ? "W"
                        : c[1] === null
                        ? "S"
                        : "L"}
                    </span>
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
