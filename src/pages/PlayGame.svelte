<script>
  import { onMount } from "svelte";

  import {
    round,
    betsList,
    isPageLoading,
    strategiesData,
    stats,
    metrics,
    mfker,
    game,
  } from "../stores/sessionStore";

  //components
  import Recorder from "../components/game/Recorder.svelte";
  import MostRecentRecords from "../components/game/MostRecentRecords.svelte";
  import Strategy from "../components/strategies/Strategy.svelte";

  import { navigate } from "svelte-navigator";
  import { fetchGame } from "../api/main/game";

  onMount(async () => {
    $isPageLoading = true;
    const resp = await fetchGame(localStorage.getItem("game_id"));
    $game = resp?.data;
    if (!$game) {
      return navigate("/new/game");
    }
    $metrics = $game.metrics.data.rightAndWrongs.pcts;
    $mfker = $game.metrics;
    $betsList = $game.bets;
    $round = $game.round;
    $strategiesData = $game.strategies;
    $stats = $game.metrics.quickStats;
    $isPageLoading = false;
    console.log($game);
  });

  $: {
    // watch for changes in theses variables
    console.log($game);
    $round;
    $betsList = $betsList;
    $strategiesData.sort((s1, s2) => {
      return 0;
      return s2.percent - s1.percent;
    });
    $strategiesData = $strategiesData;
    $stats = $stats;
  }
</script>

<div>
  <br /><br /><br />
  <div class="container-fluid p-0 bg-white">
    <div class="container">
      <div class="container">
        <Recorder game_id={$game?._id} />
        <br />
        {#if $game?.type !== "combos"}
          <div class="stats">
            <div class="text-center mb-3">
              <h5 class="d-inline mx-3 text-success">
                max W: {$stats.max_conseq_wins}
              </h5>
              <h5 class="d-inline mx-3 text-danger">
                max L: {$stats.max_conseq_losses}
              </h5>
              <h5 class="d-inline mx-3 text-success">
                total W: {$metrics.filter((x) => x).length}
              </h5>
              <h5 class="d-inline mx-3 text-danger">
                total L: {$metrics.filter((x) => x === false).length}
              </h5>
              <h5 class="d-inline mx-3">
                total S: {$metrics.filter((x) => x === null).length}
              </h5>
            </div>
            {#if Object.keys($mfker).length}
              <div class="text-center mb-3">
                <h5 class="d-inline mx-3 text-dark">Wins btw 4 Ls:</h5>
                <h5 class="d-inline mx-3 text-dark">
                  MIN: {$mfker.winsBetweenLossess.min ?? 0}
                </h5>
                <h5 class="d-inline mx-3 text-dark">
                  MAX: {$mfker.winsBetweenLossess.max ?? 0}
                </h5>
              </div>
            {/if}
            {#if Object.keys($mfker).length}
              <div class="text-center mb-3">
                <h5 class="d-inline mx-3 mx-5">
                  <b> lvl {$mfker.winsPerLvl.lvl}</b>
                </h5>
                {#each $mfker.winsPerLvl.count as m}
                  <h5 class="d-inline mx-3 text-dark">
                    <small> L{m.lvl}: </small>
                    {m.n} -
                    {Math.round(
                      (10000 * m.n) /
                        $mfker.winsPerLvl.count.reduce((acc, x) => x.n + acc, 0)
                    ) / 100}%
                  </h5>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>
      <br />

      <MostRecentRecords />
      <hr />
      {#if $game?.type !== "combos"}
        <!-- End recording Row -->
        <div class="row m-0 bg-light pt-3">
          <div class="row">
            <div class="col">
              <h2 class="text-primary mx-3">Strategies:</h2>
            </div>
          </div>
          <br />
          <div>
            {#if $strategiesData.length > 0}
              {#each $strategiesData as S, i}
                <div class="my-3">
                  <Strategy bind:strategies={$strategiesData} {S} {i} />
                </div>
              {/each}
            {/if}
          </div>
          <br />
        </div>
      {:else}
        <div class="row">
          <div class="col">
            <h2 class="text-primary mx-3">Combos:</h2>
          </div>
        </div>
        <br />

        {#if $game?.combos?.length}
          {#each $game?.combos as combo, i}
            <h4 class="text-center">Combo {i + 1}</h4>
            <div class="text-center">
              <h5 style="margin-left: 10px;" class="d-inline">
                P:
                {combo.metrics.quickStats.P_next_count} - {"  " +
                  combo.metrics.quickStats.P_next_pct +
                  "%"}
              </h5>

              <h5 style="margin-left: 10px;" class="d-inline">
                B:
                {combo.metrics.quickStats.B_next_count} - {"  " +
                  combo.metrics.quickStats.B_next_pct +
                  "%"}
              </h5>
            </div>
            <br />

            <div class="stats">
              <div class="text-center mb-3">
                <h5 class="d-inline mx-3 text-success">
                  max W: {combo?.metrics?.quickStats?.max_conseq_wins}
                </h5>
                <h5 class="d-inline mx-3 text-danger">
                  max L: {combo?.metrics?.quickStats?.max_conseq_losses}
                </h5>
                <h5 class="d-inline mx-3 text-success">
                  total W: {combo?.metrics?.data?.rightAndWrongs?.pcts.filter(
                    (x) => x
                  ).length}
                </h5>
                <h5 class="d-inline mx-3 text-danger">
                  total L: {combo?.metrics?.data?.rightAndWrongs?.pcts.filter(
                    (x) => x === false
                  ).length}
                </h5>
                <h5 class="d-inline mx-3">
                  total S: {combo?.metrics?.data?.rightAndWrongs?.pcts.filter(
                    (x) => x === null
                  ).length}
                </h5>
              </div>
              {#if combo?.metrics && Object.keys(combo?.metrics)?.length}
                <div class="text-center mb-3">
                  <h5 class="d-inline mx-3 text-dark">Wins btw 4 Ls:</h5>
                  <h5 class="d-inline mx-3 text-dark">
                    MIN: {combo?.metrics?.winsBetweenLossess?.min ?? 0}
                  </h5>
                  <h5 class="d-inline mx-3 text-dark">
                    MAX: {combo?.metrics?.winsBetweenLossess?.max ?? 0}
                  </h5>
                </div>
              {/if}
              {#if combo?.metrics && Object?.keys(combo?.metrics)?.length}
                <div class="text-center mb-3">
                  <h5 class="d-inline mx-3 mx-5">
                    <b> lvl {combo?.metrics?.winsPerLvl?.lvl}</b>
                  </h5>
                  {#each combo?.metrics?.winsPerLvl?.count as m}
                    <h5 class="d-inline mx-3 text-dark">
                      <small> L{m?.lvl}: </small>
                      {m?.n} -
                      {Math?.round(
                        (10000 * m?.n) /
                          combo?.metrics?.winsPerLvl?.count?.reduce(
                            (acc, x) => x.n + acc,
                            0
                          )
                      ) / 100}%
                    </h5>
                  {/each}
                </div>
              {/if}
            </div>
            <br />
            {#if combo?.strategies?.length}
              {#each combo.strategies as S, i}
                <div class="my-1">
                  <Strategy bind:strategies={$strategiesData} {S} {i} />
                </div>
              {/each}
            {/if}

            <br />
            <hr />
            <br />
          {/each}
        {/if}
        <br />
      {/if}

      <!-- End Strategies Row -->
    </div>

    <br /><br />
  </div>
  <!-- End Container  -->
</div>
