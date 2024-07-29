<template>
  <ListRenderer ref="renderer" :api-root="apiRoot" :col="rendererColDef" :cfg="cfg" :initTableData="initTableData" :search-fields="searchFields" />
</template>

<script lang="ts" src="./list-loader.ts"></script>

