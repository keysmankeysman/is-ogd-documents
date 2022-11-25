<template>
  <div class="container">
    <tabs class="flex-column flex-1 tabs set-height" @change="onTabChange">
      <tab title="По видам" class="flex-column flex-1">
        <checkbox
          class="center"
          title="Отображать документы нижестоящих категорий"
          v-model="allowSubCategories"
        />
        <searchable-lazy-tree
          class="flex-1"
          v-if="documentTypesTree.length"
          :items="documentTypesTree"
          :renderNameFunc="renderDocTypeTreeItem"
          :itemClassFunc="addClassToDocumentTypeItem"
          :disableCheckboxCondition="(item) => !item.id"
          :multiple="false"
          placeholder="Для поиска введите не менее 3х символов и нажмите Ввод"
          @selectItem="$emit('documentTypeSelected', $event)"
          @foundItems="found"
          @filter="getFilter"
          @clearSearch="clearSearch"
        />
      </tab>
      <tab title="По территориям" class="flex-column flex-1">
        <checkbox
          class="center"
          title="Отображать документы нижестоящих территорий"
          v-model="allowSubTerritories"
        />
        <searchable-lazy-tree
          class="flex-1"
          v-if="orderedTerritoryTree.length"
          :items="orderedTerritoryTree" 
          :renderNameFunc="renderTerritoryTreeItem"
          :itemClassFunc="addClassToTerritoryItem"
          :disableCheckboxCondition="(item) => !item.id"
          :multiple="false"
          placeholder="Для поиска введите не менее 3х символов и нажмите Ввод"
          @selectItem="$emit('territorySelected', $event)"
          @foundItems="found"
          @filter="getFilter"
        />
      </tab>
      <tab title="Область гос. значения" class="flex-column flex-1">
        <checkbox
          class="center"
          title="Отображать документы нижестоящих категорий"
          v-model="allowStateSubCategories"
        />
        <searchable-lazy-tree
          class="flex-1"
          v-if="stateAreaDocumentsTree.length"
          :items="stateAreaDocumentsTree"
          :renderNameFunc="renderDocTypeTreeItem"
          :itemClassFunc="addClassToDocumentTypeItem"
          :disableCheckboxCondition="(item) => !item.id"
          :multiple="false"
          placeholder="Для поиска введите не менее 3х символов и нажмите Ввод"
          @selectItem="$emit('stateAreaSelected', $event)"
          @foundItems="found"
          @filter="getFilter"
        />
      </tab>
      <tab title="Область местного значения" class="flex-column flex-1">
        <form-row>
          <form-group :columns="6" minWidth="130px">
            <checkbox
              class="center"
              title="Отображать документы нижестоящих категорий"
              v-model="allowLocalSubCategories"
            />
          </form-group>
          <form-group title="Список служб ИСОГД" :columns="6" minWidth="130px">
            <select2
              :data="isogdServicesFiltered"
              v-model="isogdServiceId"
              :hideFilter="false"
            />
          </form-group>
        </form-row>
        <searchable-lazy-tree
          class="flex-1"
          v-if="localAreaDocumentsTree.length"
          :items="localAreaDocumentsTree"
          :renderNameFunc="renderDocTypeTreeItem"
          :itemClassFunc="addClassToDocumentTypeItem"
          :disableCheckboxCondition="(item) => !item.id"
          :multiple="false"
          placeholder="Для поиска введите не менее 3х символов и нажмите Ввод"
          @selectItem="$emit('localAreaSelected', $event)"
          @foundItems="found"
          @filter="getFilter"
        />
      </tab>
    </tabs>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
import _sortBy from 'lodash/sortBy'
import { TreeBuilder } from '../terrZone/terrZoneHelper.js'
import { libraryOktmoTree } from '../data/libraryOktmoTree'

export default {
  components: {
  },
  data () {
    return {
      documentTypes: [],
      documentTypesTree: [],
      stateAreaDocumentsTree: [],
      localAreaDocumentsTree: [],
      allowSubCategories: true,
      allowSubTerritories: false,
      allowStateSubCategories: true,
      allowLocalSubCategories: true,
      foundItems: [],
      filter: '',
      isogdServicesFiltered: [],
      isogdServiceId: null,
      territoryTree: null
    }
  },
  async mounted () {
    this.territoryTree = libraryOktmoTree


    this.documentTypes = await this.customApi.isogdDocuments.getDocumentTypes()
    const orderedDocumentTypes = _sortBy(this.documentTypes, ['gkCode', 'name'])

    let AllDocumentTypesIds = this.documentTypes.map(el => el.id)

    this.documentTypesTree = new TreeBuilder(orderedDocumentTypes).buildTree().root

    this.$emit('upAllDocumentNodes', AllDocumentTypesIds)

    const stateAreaAllDocumentsTree = new TreeBuilder(orderedDocumentTypes).buildTree().root
    for (const item of stateAreaAllDocumentsTree) {
      item.children = item.children.filter(x => x.stateWorkingArea === true)
    }
    this.stateAreaDocumentsTree = stateAreaAllDocumentsTree.filter(x => x.children.length)
    const localAreaAllDocumentsTree = new TreeBuilder(orderedDocumentTypes).buildTree().root
    for (const item of localAreaAllDocumentsTree) {
      item.children = item.children.filter(x => x.localWorkingArea === true)
    }
    this.localAreaDocumentsTree = localAreaAllDocumentsTree.filter(x => x.children.length)

    const isogdServices = await this.customApi.isogdDocuments.getIsogdServices()
    this.isogdServicesFiltered = isogdServices.filter(x => x.urbanPlanningObject.Type.code === '1')
    if (this.isogdServicesFiltered.length === 1) {
      this.isogdServiceId = this.isogdServicesFiltered[0].id
    }
  },
  computed: {
    // ...mapState({
    //   territoryTree: state => state.user.libraryOktmoTree
    // }),
    orderedTerritoryTree () {
      return _sortBy(this.territoryTree, x => x.name)
    }
  },
  watch: {
    'allowSubCategories': function () {
      this.$emit('allowSubCategories', this.allowSubCategories)
    },
    'allowSubTerritories': function () {
      this.$emit('allowSubTerritories', this.allowSubTerritories)
    },
    'allowStateSubCategories': function () {
      this.$emit('allowStateSubCategories', this.allowStateSubCategories)
    },
    'allowLocalSubCategories': function () {
      this.$emit('allowLocalSubCategories', this.allowLocalSubCategories)
    },
    isogdServiceId: function () {
      this.$emit('isogdServiceId', this.isogdServiceId)
    }
  },
  methods: {
    renderDocTypeTreeItem (item) {
      let itemRow = ''
      if (item.gkCode === null) {
        itemRow = '_' + item.name
      } else {
        itemRow = item.gkCode + ' ' + item.name
      }

      return itemRow
    },
    renderTerritoryTreeItem (item) {
      return item.name + ' (' + item.code + ')'
    },
    addClassToDocumentTypeItem (item) {
      this.expandTree(item)

      if (this.filter !== '') {
        const itemFound = item.text.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
        if (itemFound) {
          return ({
            'greenItem': true
          })
        } else {
          return ({
            'blackItem': true
          })
        }
      } else {
        if (item.value && !item.loading) {
          if (item.value.item.isObsolete) {
            return ({
              'greyItem': true
            })
          }
        }
        return {}
      }
    },
    addClassToTerritoryItem (item) {
      this.expandTree(item)

      if (this.filter !== '') {
        const itemFound = item.text.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
        if (itemFound) {
          return ({
            'greenItem': true
          })
        } else {
          return ({
            'blackItem': true
          })
        }
      } else {
        if (item.value && !item.loading) {
          if (item.value.item.is_obsolete) {
            return ({
              'greyItem': true
            })
          }
        }
      }
    },
    expandTree (item) {
      if (!item.value || item.loading) {
        return
      }

      if (this.foundItems.length > 0) {
        for (let foundItem of this.foundItems) {
          if (item.value.item.id === foundItem.id) {
            this.expandChildren(item)
          }
        }
      }
    },
    expandChildren (item) {
      if (item.loading) {
        return
      }
      this.$nextTick()
        .then(() => {
          // item.loading = true
          item.opened = true
        })

      for (const child of item.children) {
        if (!child.loading) {
          this.expandChildren(child)
        }
      }
    },
    onTabChange (index) {
      this.$emit('tabClicked', index)
    },
    found (items) {
      this.foundItems = items
    },
    getFilter (filter) {
      this.filter = filter
      if (this.filter === '') {
        this.foundItems = []
        return
      }
    },
    clearSearch () {
      // Чистим фильтры на событие очистка фильтров
      this.filter = ''
      this.foundItems = []
    }
  }
}
</script>

<style scoped>
.container {
  width: 250px;
}

.center {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.set-height {
  height: 100%;
}

.container .greenItem {
  color: green;
}

.container .blackItem {
  color: black;
}

</style>
