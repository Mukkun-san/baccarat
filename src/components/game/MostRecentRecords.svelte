<script>
  import { onMount } from "svelte";

  import {
    metrics,
    betsList,
    strategiesData,
    stats,
  } from "../../stores/sessionStore";
  import Strategy from "../strategies/Strategy.svelte";

  import TableRecords from "./TableRecords.svelte";

  let nbrRows = 6;
  let nbrCols = 10;

  onMount(() => {
    const r = localStorage.getItem("nbrRows");
    const c = localStorage.getItem("nbrCols");
    nbrRows = r ? parseInt(r) : nbrRows;
    nbrCols = c ? parseInt(c) : nbrCols;
  });

  function onDimensionsChange(e) {
    const x = e.target.value;
    if (x < 1 || x > 10) {
      window.pushToast("Enter number between 1 and 10", "danger", 5000);
    } else {
      if (e.target.name === "nbrRows") {
        nbrRows = parseInt(x);
        localStorage.setItem("nbrRows", nbrRows);
      } else if (e.target.name === "nbrCols") {
        nbrCols = parseInt(x);
        localStorage.setItem("nbrCols", nbrCols);
      }
    }
  }

  $: {
    $stats;
  }
</script>

<div>
  <div class="d-flex justify-content-center">
    <div
      class="input-group mx-4 d-flex align-items-center"
      style="width: 200px;"
    >
      <input
        class="d-inline form-control"
        type="number"
        min="1"
        max="10"
        name="nbrRows"
        style="width: 80px; height:50px; font-weight: 500;font-size: 30px;"
        value={nbrRows}
        on:change={onDimensionsChange}
      />

      <b style="font-weight: 900;font-size: 30px;" class="mx-1">X</b>

      <input
        class="form-control d-inline"
        type="number"
        min="1"
        max="10"
        value={nbrCols}
        name="nbrCols"
        style="width: 80px; height:50px; font-weight: 500;font-size: 30px;"
        on:change={onDimensionsChange}
      />
    </div>
  </div>

  <hr class="mx-3" style="width: auto;" />

  {#if $strategiesData.filter((s) => s.pinned).length}
    <div>
      <br />
      {#each $strategiesData.filter((s) => s.pinned) as S, i}
        <Strategy bind:strategies={$strategiesData} {S} {i} />
      {/each}
      <br />
    </div>
    <hr class="mx-3" style="width: auto;" />
  {/if}
  <TableRecords
    betsList={$betsList}
    metrics={$metrics}
    {nbrRows}
    {nbrCols}
    from={null}
    to={null}
    slice={false}
  />

  <br />
</div>

<style>
</style>
