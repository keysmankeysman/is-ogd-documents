<template>
  <div class="dt-body">
    <table class="table dataTable">
      <colgroup>
        <col
          v-for="(column, index) of columns"
          :key="index"
          :style="{ 'width': column.calculatedWidth }">
      </colgroup>
      <tbody>
        <template v-for="(item, index) of objects">
          <tr :key="index">
            <td
              v-for="(column, columnIndex) of columns"
              :key="columnIndex"
            >
              <span>{{ getValue(item.attributes, column) }}</span>
            </td>
            <!-- <td
              v-for="(column, columnIndex) of columns"
              :key="columnIndex"
            >
              <span>{{ getValue(item, column) }}</span>
            </td> -->
          </tr>
        </template>
        <!-- <template v-for="(item, itemIndex) of items">
          
          <tr
            :key="itemIndex"
          >
            <td
              v-for="(column, columnIndex) of columns"
              :key="columnIndex"
            >
              <span>{{ getValue(item, column) }}</span>
            </td>
          </tr>
        </template> -->



        </tbody>
    </table>
  </div>
</template>

<script>
// import _get from 'lodash/get'

export default {
  props: {
    value: Object,
    columns: Array,
    items: Array
  },
  methods: {
    getValue (item, column) {
      let columnValue
      item.forEach(el => {
        console.log(el)
        if(el.name === column.field) {
          columnValue = el.value
        }
      })
      return columnValue
    }
  },
  data () {
    return {
      objects: [
        {
          attributes: [
            {
              "name": "Статус",
              "value": "Действующий",
              "originalName": "status"
            }, {
              "name": "Вид документа",
              "value": "Решение о присвоении, аннулировании изменении адреса",
              "originalName": "document_type"
            }, {
              "name": "Наименование документа",
              "value": "Решение о присвоении адреса ул. ДОК, СНТ \"СУ-322\", участок 134",
              "originalName": "doc_name"
            }, {
              "name": "Служба ИСОГД",
              "value": "Адм Сланцевский МР",
              "originalName": "isogd_service"
            }, {
              "name": "Территория",
              "value": "г Сланцы",
              "originalName": "territory"
            }, {
              "name": "Кадастровый номер",
              "value": "47:28:0304001:213",
              "originalName": "cadastral_number"
            }
          ],
          crs:"urn:ogc:def:crs:EPSG::3857",
          isShare:true
        },
        {
          attributes: [
            {
              "name": "Статус",
              "value": "Не Действующий",
              "originalName": "status"
            }, {
              "name": "Вид документа",
              "value": "Решение о присвоении, аннулировании изменении адреса",
              "originalName": "document_type"
            }, {
              "name": "Наименование документа",
              "value": "Решение о присвоении адреса ул. ДОК, СНТ \"СУ-322\", участок 134",
              "originalName": "doc_name"
            }, {
              "name": "Служба ИСОГД",
              "value": "Адм Сланцевский МР",
              "originalName": "isogd_service"
            }, {
              "name": "Территория",
              "value": "г Выборг",
              "originalName": "territory"
            }, {
              "name": "Кадастровый номер",
              "value": "47:28:0304001:213",
              "originalName": "cadastral_number"
            }
          ],
          crs:"urn:ogg:ded:cra:EPSG::3857"
        }
      ]
    }
  },
  computed: {
    trueItems () {
      return this.objects.map(i => i.attributes)
    }
  }
}
</script>

<style scoped>
.has-warning {
  border: 1px solid red;
}
.borders {
  border: 0.5px solid #bbb;
  border-collapse: collapse;
}
.dt-body {
  flex: 1 1 0;
  -ms-flex-preferred-size: 0px;
  -ms-flex-negative: 0;
  overflow: auto;
  height: 450px;
  border-bottom: 1px solid #bbb;
  flex-basis: 450px;
}
.dt-body table {
  table-layout: fixed;
  border-top: none;
  border-collapse: collapse;
}
.dt-body table.no-rows-table {
  height: 100%;
}
.dt-body.no-rows-table {
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}
.dt-body div.no-data-tooltip-container {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content:center;
  align-content:center;
  flex-direction:column;
}
.dt-body .no-data-cell-placeholder {
  padding-bottom: 0px;
  padding-top: 1px;
}
.dt-body div.no-data-tooltip {
  text-align: center;
  margin: 10px;
  font-size: 15px;
  font-weight: bold;
}
.dt-header + .dt-body table {
  border-top: 1px solid #ddd;
}
.dt-body tbody > tr.selected {
  background-color: #e3f2fd;
  color: #104d92;
}
.dt-body tr span {
  max-height: 4.8em;
  overflow: hidden;
  display: block;
}

.dt-body tr a {
  max-height: 4.8em;
  overflow: hidden;
  display: block;
}

.data-table-lookup-input .form-control {
  padding: 3px 10px !important;
  height: 30px !important
}
.data-table-lookup-input .select2-selection.select2-selection--single {
  height: 30px;
  padding-top: 4px
}
td {
  word-break: break-word;
  text-align: center;
}
.aggregation-row-column {
  border-top: 1.4px solid #000000;
  vertical-align: bottom;
}
.aggregation {
  border: 2.4px solid #000000;
  vertical-align: bottom;
}
.data-table-links-cell > a {
  display: block
}
</style>
