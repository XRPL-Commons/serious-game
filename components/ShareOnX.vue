<template>
  <UButton @click="shareOnX" color="blue" class="mb-2">Share on X</UButton>
</template>
<script lang="ts" setup>
function shareOnX() {
  const breaks = "%0A";
  const text1 = encodeURIComponent("I cracked the code in the latest XRPL Community Mag and won an Albers inspired generative art NFT!");
  const text2 = encodeURIComponent("Check it out at: https://mag.xrpl.quest");
  const text3 = encodeURIComponent("Claim your own: https://xrpl.at/commons-mag-02");

  const hashtags = "NFT,XRPL";
  const via = "xrpl_commons";
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text1}${breaks}${text2}${breaks}${breaks}${text3}${breaks}${breaks}&hashtags=${hashtags}&via=${via}`;
  window.open(twitterUrl, '_blank');
}
</script>