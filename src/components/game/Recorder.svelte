<script>
  import {
    bet,
    round,
    betsList,
    strategiesData,
    stats,
    metrics,
    mfker,
    game,
  } from "../../stores/sessionStore";

  import { saveRecordDB, fetchGame, undoRecordDB } from "../../api/main/game";
  import { onMount } from "svelte";

  let newMetric = { pctBs: 0, pctPs: 0, Ps: 0, Bs: 0 };

  onMount(async () => {
    const resp = await fetchGame(game_id);
    const game = resp?.data;
    console.log(game);
    newMetric = game.stats;
  });

  async function addRecord() {
    if (busy) {
      return window.pushToast("recorder busy", "danger");
    }
    busy = true;
    const response = await saveRecordDB($bet, game_id);
    if (response.status !== 200) {
      window.pushToast("There was an error adding the record!", "danger");
      return;
    }
    $game = response.data;
    newMetric = $game.stats;
    console.log(newMetric);
    console.log(newMetric);
    $round = $betsList.length + 1;
    $betsList = $game.bets;
    $metrics = $game.metrics.data.rightAndWrongs.pcts;
    const temp = $strategiesData;
    $strategiesData = $game.strategies;
    temp.forEach((s, i) => {
      if (s.pinned) {
        $strategiesData[i].pinned = true;
      }
    });
    $stats = $game.metrics.quickStats;
    $mfker = $game.metrics;

    busy = false;
  }

  function handleKeydown(e) {
    const KEY = e.key.toUpperCase();
    if (["P", "B"].includes(KEY)) {
      $bet = KEY;
      addRecord();
    } else if (KEY === "BACKSPACE") {
      undoRecord();
    }
  }

  async function undoRecord() {
    const response = await fetchGame(game_id);
    const game = response.data;
    if ($betsList.length && game.undos) {
      const res = await undoRecordDB(game_id);
      if (res.status === 200) {
        location.reload();
        return;
        $strategiesData = game.strategies;
        $stats = game.stats;
        $betsList.pop();
        $round--;
        $betsList = $betsList;
      } else {
        window.pushToast("Can't Undo!", "warning");
      }
    } else {
      window.pushToast("Can't Undo!", "warning");
    }
  }
  let game_id = localStorage.getItem("game_id");

  let busy = false;
</script>

<svelte:window on:keydown={handleKeydown} />

<div>
  <br />

  <div style="display: flex;align-items: center;justify-content:center;">
    <div style="position:relative;">
      <button
        on:click={() => {
          $bet = "P";
          addRecord();
        }}
        class={"btn btn-lg btn-outline-primary " +
          ($bet === "P" ? "active" : "")}
        style="font-size: 1.5rem; min-width:120px;"
        type="button"
      >
        P
        {#if $game?.type === "combos"}
          <small style="margin-left: 10px;">
            {newMetric?.Ps} - {"  " + newMetric?.pctPs + "%"}</small
          >
        {:else}<small style="margin-left: 10px;">
            {$stats.P_next_count} - {"  " + $stats.P_next_pct + "%"}</small
          >
        {/if}
      </button>
      <h5 style="position: absolute;margin-top: -80px;left: 0;">
        {$stats.pct_avg_P}%
      </h5>
    </div>
    <div style="position:relative;">
      <button
        on:click={(e) => {
          $bet = "B";
          addRecord();
        }}
        class={"btn btn-lg btn-outline-danger mx-2 " +
          ($bet === "B" ? "active" : "")}
        style="font-size: 1.5rem; min-width:120px;"
        type="button"
      >
        B

        {#if $game?.type === "combos"}
          <small style="margin-left: 10px;">
            {newMetric?.Bs} - {"  " + newMetric?.pctBs + "%"}</small
          >
        {:else}
          <small style="margin-left: 10px;">
            {$stats.B_next_count} - {"  " + $stats.B_next_pct + "%"}</small
          >
        {/if}
      </button>
      <h5 style="position: absolute;margin-top: -80px;right: 0;">
        {$stats.pct_avg_B}%
      </h5>
    </div>
    <button
      on:click={undoRecord}
      class="btn btn-lg btn-outline-warning mx-4"
      style="font-size: 1.5rem;"
      type="button"
    >
      Undo
    </button>
  </div>
</div>

<style>
</style>
