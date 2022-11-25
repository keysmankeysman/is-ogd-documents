<template>
  <div class="dt-table">
    <data-table-header
      :sorting="sorting"
      @onSortField="onSortField"
      ref="header"
    />
    <data-table-body 
      :items='paginationItems'
      :columns="columns"
      :selectable="selectable"
    />
  </div>
</template>

<script>
import DataTableHeader from './DataTableHeader'
import DataTableBody from './DataTableBody'

export default {
  props: {
    columns: Array,
    items: {
      type: Array,
      required: true
    },
    count: Number,
    value: Object,
    pagable: Boolean,
    selectable: Boolean
  },
  components: {
    DataTableHeader,
    DataTableBody
  },
  data () {
    return {
      sorting: [],
      filters: [],
      myFilters: [],
      page: 1,
      size: 10,
      from: 1,
      to: 10
    }
  },
  watch: {
    columns: 'resetFilters'
  },
  computed: {
    paginationItems () {
      let newArr = [...this.items]
      if (this.myFilters.length) {
        let filterItems = newArr.filter(item => {
          let flag = false
          for (let i = 0; i < this.myFilters.length; i++) {
            if ((item[this.myFilters[i].field].indexOf(this.myFilters[i].value) + 1)) {
              flag = true
            } else {
              flag = false
              return false
            }
          }
          return flag
        })
        newArr = [...filterItems]
      }
      let cutArr = newArr.slice(this.from - 1, this.to)
      return cutArr
    },
    calculatedColumns () {
      if (!this.columns || !this.columns.length) {
        return []
      }
      return this.columns.map(x => ({
        calculatedWidth: this.calculateColumnWidth(x),
        textAlign: this.getColumnTextAlign(x),
        ...x
      }))
    }
  },
  created () {
    this.setupColumns()
  },
  methods: {
    onSortField (val) {
      this.$emit('onSortField', val)
    },
    onFilter (filter) {
      this.myFilters.push(filter)
    },
    onPage ({ page, size }) {
      this.page = page
      this.size = size
      if (this.count === 0) {
        return
      }
      this.from = (this.page - 1) * this.size + 1

      if (this.from + this.size - 1 > this.count) {
        this.to = this.count
      } else {
        this.to = this.from + this.size - 1
      }
    },
    resetPage () {
      this.page = 1
    },
    calculateColumnWidth (column) {
      if (column.width) {
        return column.width
      }
      if (column.displayAs) {
        switch (column.displayAs) {
          case 'date':
          case 'input':
            return this.getColumnWidthFromStringLength(column.title, 100, 150) + 'px'
          case 'datetime':
            return this.getColumnWidthFromStringLength(column.title, 100, 170) + 'px'
          case 'number':
            return this.getColumnWidthFromStringLength(column.title, 170, 180) + 'px'
        }
      }
      return this.getColumnWidthFromStringLength(column.title) + 'px'
    },
    getColumnTextAlign (column) {
      if (column.displayAs) {
        switch (column.displayAs) {
          case 'date':
          case 'input':
          case 'datetime':
            return 'center'
          case 'number':
            return 'right'
        }
      }
      return 'center'
    },
    getColumnWidthFromStringLength (str, minWidth = 150, maxWidth = 200) {
      const widthMultiplier = 10
      const widthAddingNumber = 20
      let width = str.length * widthMultiplier + widthAddingNumber

      if (width < minWidth) {
        width = minWidth
      }
      if (width > maxWidth) {
        width = maxWidth
      }
      return width
    },
    setupColumns () {
      this.sorting = this.columns.map(x => ({
        column: x,
        calculatedWidth: this.calculateColumnWidth(x),
        selectable: x.type === 'checkbox',
        sortable: x.sortable === false ? false : this.sortable
      }))
      this.filters = this.columns.map(x => ({
        column: x,
        calculatedWidth: this.calculateColumnWidth(x),
        value: x.filter ? x.filter.value : null
      }))
    },
    resetFilters (newValue, oldValue) {
      this.setupColumns()
      this.page = 1
      if (oldValue.length && newValue.length) {
        this.onChange()
      }
    }
  }
}
</script>

<style scoped>
.dt-table {
  display: flex;
  flex-direction: column;
}
.dt-table.has-err {
  border: 1px solid #D84315;
  border-radius: 3px;
}
div.modal-dialog .modal-body > .dt-table {
  min-height: 500px;
  height: 500px;
}
div.modal-dialog.modal-lg .modal-body > .dt-table {
  min-height: 460px;
  height: 460px;
}

.dt-table__nav-btn {
  min-width: 88px;
  min-height: 36px;
  margin: 6px 8px;
  padding: 0 16px;
  display: inline-block;
  position: relative;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
  background: none;
  border: 0;
  border-radius: 2px;
  transition: all .4s cubic-bezier(.25,.8,.25,1);
  color: currentColor;
  font-family: sans-serif;
  font-size: 14px;
  font-style: inherit;
  font-variant: inherit;
  font-weight: 500;
  letter-spacing: inherit;
  line-height: 36px;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  vertical-align: top;
  white-space: nowrap;
  box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%);
}

.dt-table__nav-btn:active {
  color: #fff;
  background-color: rgba(0, 0, 0, .87);
}

.dt-table__nav-btns {
  display: flex;
  margin-bottom: 24px;
}


@media (min-height: 700px) {
  div.modal-dialog.modal-lg .modal-body > .dt-table {
    min-height: 500px;
    height: 500px;
  }
}
@media (min-height: 800px) {
  div.modal-dialog.modal-lg .modal-body > .dt-table {
    min-height: 600px;
    height: 600px;
  }
}
@media (min-height: 900px) {
  div.modal-dialog.modal-lg .modal-body > .dt-table {
    min-height: 700px;
    height: 700px;
  }
}
</style>
