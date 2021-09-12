<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { createGame, getAllStrategies } from "../api/main/game";
  import Strategy from "../components/strategies/Strategy2.svelte";
  import { isPageLoading, user } from "../stores/sessionStore";

  onMount(async () => {
    $isPageLoading = true;
    const res = await getAllStrategies();
    strategies = res.data;
    strategies.forEach((S) => {
      S.maxLvl = 10;
    });
    let localStrategies = localStorage.getItem("strategies");
    if (localStrategies) {
      localStrategies = JSON.parse(localStrategies);
      localStrategies.forEach((s1) => {
        let S = strategies.find((s2) => s1.name === s2.name);
        if (S) {
          S.maxLvl = s1.maxLvl;
          S.enabled = s1.enabled;
        }
      });
    } else {
      localStorage.setItem("strategies", JSON.stringify(strategies));
    }
    $isPageLoading = false;
  });

  function enableAllStrats() {
    strategies = strategies.map((S) => ({ ...S, enabled: true }));
    localStorage.setItem("strategies", JSON.stringify(strategies));
  }

  function disableAllStrats() {
    strategies = strategies.map((S) => ({ ...S, enabled: false }));
    localStorage.setItem("strategies", JSON.stringify(strategies));
  }

  function setDefaultMaxLvl(e) {
    defaultMaxLvl = e.target.value;
    strategies = strategies.map((S) => {
      return { ...S, maxLvl: defaultMaxLvl };
    });
    localStorage.setItem("defaultMaxLvl", defaultMaxLvl);
    localStorage.setItem("strategies", JSON.stringify(strategies));
  }

  async function createNewGame() {
    const selectedStrategies = strategies.filter((s) => s.enabled);
    const gameType = gameUsingCombos ? "combos" : "strategies";
    const resp = await createGame(
      $user._id,
      selectedStrategies,
      gameName,
      gameType
    );
    if (resp.status === 201) {
      localStorage.setItem("game_id", resp.data._id);
      navigate("/play");
      window.pushToast(resp.msg, "success");
    } else {
      window.pushToast(resp.msg, "danger");
    }
  }

  let strategies = [],
    defaultMaxLvl = localStorage.getItem("defaultMaxLvl") || 10,
    gameName = "",
    gameUsingCombos = true;
</script>

<div style="margin: 0;padding:0;">
  <main>
    <br /><br /><br />
    <div class="d-flex justify-content-center align-items-center">
      <button on:click={enableAllStrats} class="btn btn-md btn-success mx-3">
        enable all
      </button>
      <button on:click={disableAllStrats} class="btn btn-md btn-danger mx-3">
        disable all
      </button>
      <div>
        <input
          class="form-control"
          style="width: fit-content;max-width:50px;font-weight:700;"
          type="number"
          value={defaultMaxLvl}
          on:change={setDefaultMaxLvl}
        />
      </div>
      <div class="form-check form-switch mx-5">
        <input
          style="width: 45px;height:20px"
          class="form-check-input mx-2"
          type="checkbox"
          id="gameUsingCombosCheckBox"
          checked={gameUsingCombos}
          on:change={(e) => (gameUsingCombos = !gameUsingCombos)}
        />
        <label class="form-check-label" for="gameUsingCombosCheckBox">
          Game mode: {gameUsingCombos ? " Combos" : " Strategies"}
        </label>
      </div>

      <input
        class="form-control"
        style="max-width:175px;"
        type="text"
        value={gameName}
        on:change={(e) => (gameName = e.target.value)}
        placeholder="enter game name"
      />
      <button on:click={createNewGame} class="btn btn-md btn-info mx-3">
        Start Game!
      </button>
    </div>

    <br />

    {#if strategies.length}
      {#each strategies as S, i}
        <div class="container my-3">
          <Strategy {strategies} {S} {i} />
        </div>
      {/each}
    {/if}

    <br />
  </main>
</div>

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }

  input[type="number"] {
    -moz-appearance: textfield; /* Firefox */
  }
</style>
