<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import moment from "moment";
  import { getAllGames, deleteGame as delGameDB } from "../api/main/game";

  import { isPageLoading, sideBarShow, user } from "../stores/sessionStore";

  async function selectGame(_id) {
    if (!_id) {
      return;
    }
    localStorage.setItem("game_id", _id);
    navigate("/play");
    $sideBarShow = false;
    location.reload();
  }

  async function deleteGame(_id) {
    const resp = await delGameDB(_id);
    if (resp.status === 200) {
      await fetchGames();
      window.pushToast(resp.msg, "success");
    }
    $sideBarShow = false;
  }

  async function fetchGames() {
    $isPageLoading = true;
    const response = await getAllGames($user._id);
    if (!response?.data?.length) {
      navigate("/new/game");
    }
    games = response.data;
    $isPageLoading = false;
  }

  onMount(() => {
    fetchGames();
  });

  let games = [];
</script>

<div>
  {#if games.length}
    <div class="px-3 d-flex justify-content-center">
      <table class="table table-hover table-dark">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each games as game}
            <tr
              on:click={() => {
                selectGame(game._id);
              }}
            >
              <th scope="row">1</th>
              <td>{game.name}</td>
              <td>{game.type}</td>
              <!-- <td>{moment(game.startedOn).fromNow()}</td> -->
              <td
                on:click={() => {
                  deleteGame(game._id);
                }}><button class="btn btn-sm btn-danger">delete</button></td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
