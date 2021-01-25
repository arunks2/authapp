<template>
    <div class="AppTableContainer" :class="{ Expanded : expanded, FixedHeader: fixedHeader != undefined, NotFixedHeader: fixedHeader == undefined, Heighted: height, White: background != undefined }" :style="'height:' + height" width="100%" ref="AppTableContainer">
      <div class="FixedHeaderContent" v-if="fixedHeader != undefined" id="FixedHeader" :style="'width:' + appContentWidth">
        <table class="AppTable FixedHeader" v-if="fixedHeader != undefined" :style="'width:' + appTableWidth">
          <thead>
            <tr>
              <th v-if="checkboxes != undefined" class="Checkboxes"><input type="checkbox" class="uk-checkbox" v-model="allSelected" /></th>
              <th v-for="(column, index) in columns" :key="index" v-if="column.show != false" :class="{'Sortable':column.sort}" :width='column.width == undefined ? "auto" : column.width'>
                <a href='#' v-if="column.sort" @click.prevent="sortByFunction(column)" :class="{ 'Sorting': (sort[column.field] != 'none'), 'Asc' : (sort[column.field] == 'asc'), 'Desc' : (sort[column.field] == 'desc') }">
                  {{ column.label }}
                  <i class="none ti-arrows-vertical"></i>
                  <i class="asc ti-angle-up"></i>
                  <i class="desc ti-angle-down"></i>
                </a>
                <span v-else>
                  {{ column.label }}
                </span>
              </th>
            </tr>
          </thead>
          <thead v-if="filters != undefined">
            <tr class="Filters">
              <th class="Filter Checkboxes" v-if="checkboxes != undefined"></th>
              <th class="Filter" v-for="(column, index) in columns" :key="index" v-if="column.show != false" :class="{ 'Active' : (column.filter != undefined && column.filter.value != '' && column.filter.value != null) }" >
                <span v-if="column.filter">
                  <span v-if="column.filter.type == 'text'">
                    <input @blur="filterTable" type="text" :placeholder = '(typeof(column.filter.placeholder) == "undefined") ? "Filter " + column.label : column.filter.placeholder' v-model="column.filter.value" />
                  </span>
                  <span v-else-if=" column.filter.type == 'number' ">
                    <input type="number" :placeholder = '(typeof(column.filter.placeholder) == "undefined") ? "Filter " + column.label : column.filter.placeholder' v-model="column.filter.value" />
                  </span>
                  <span v-else-if="column.filter.type == 'date'">
                    <date-picker lang="en" format="DD/MM/YYYY" :first-day-of-week="1" v-model="column.filter.value"></date-picker>
                  </span>
                  <span v-else-if="column.filter.type == 'daterange'">
                    <date-picker lang="en" format="DD/MM/YYYY" range :first-day-of-week="1" v-model="column.filter.value"></date-picker>
                  </span>
                  <span v-else-if="column.filter.type == 'select'">
                   <!--  <v-select  @input="filterTable" v-if='column.filter.values' :options='column.filter.values' :label="column.filter.labelField" :placeholder = '(typeof(column.filter.placeholder) == "undefined") ? "Filter " + column.label : column.filter.placeholder' v-model="column.filter.value"></v-select> -->
                   <no-ssr>
                    <treeselect v-if='column.filter.values'  v-model="column.filter.value" :multiple="true" :options="column.filter.values"  @close="filterTable" :label="column.filter.labelField" />
                  </no-ssr>
                  </span>
                </span>
                <span v-else></span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in dataClone" :key="row.id">
              <td v-if="checkboxes != undefined" class="Checkboxes"><input type="checkbox" class="uk-checkbox" :value="row" v-model="selectedData" /></td>
              <td v-for="(column, index) in columns" :key="index" v-if="column.show != false">
                <slot name="override" v-if="column.override == true" v-bind:row="row" v-bind:column='column'>Default Content</slot>
                <slot v-bind:row="row" v-bind:column='column' v-else>
                  <span v-if="column.type == 'date'">{{ formatDate(row[column.field], column.format) }}</span>
                  <span v-else>{{ row[column.field] }}</span>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="AppTableContent" id="AppTableContent" ref='AppTableContent' :style="'width:' + appContentWidth">
        <table class="AppTable" id="AppTable" ref='AppTable' :class="{RemoveHeaders : fixedHeader != undefined}" :style="'width:' + appTableWidth">
          <thead :class="{ zeroHeight: fixedHeader != undefined }">
            <tr>
              <th v-if="checkboxes != undefined" class="Checkboxes"><input type="checkbox" class="uk-checkbox" /></th>
              <th v-for="(column, index) in columns" :key="index" v-if="column.show != false" :class="{'Sortable':column.sort}" :width='column.width == undefined ? "auto" : column.width'>
                <a href='#' v-if="column.sort" @click.prevent="sortByFunction(column)" :class="{ 'Sorting': (sort[column.field] != 'none'), 'Asc' : (sort[column.field] == 'asc'), 'Desc' : (sort[column.field] == 'desc') }">
                  {{ column.label }}
                  <i class="none el-icon-d-caret"></i>
                  <i class="asc el-icon-caret-top"></i>
                  <i class="desc el-icon-caret-bottom"></i>
                </a>
                <span v-else>
                  {{ column.label }}
                </span>
              </th>
            </tr>
          </thead>
          <thead v-if="filters != undefined">
            <tr class="Filters">
              <th class="Filter Checkboxes" v-if="checkboxes != undefined"></th>
              <th class="Filter" v-for="(column, index) in columns" :key="index" v-if="column.show != false" :class="{ 'Active' : (column.filter != undefined && column.filter.value != '' && column.filter.value != null) }" >
                <span v-if="column.filter">
                  <span v-if="column.filter.type == 'text'">
                    <input  @blur="filterTable" type="text" :placeholder = '(typeof(column.filter.placeholder) == "undefined") ? "Filter " + column.label : column.filter.placeholder' v-model="column.filter.value" />
                  </span>
                  <span v-else-if=" column.filter.type == 'number' ">
                    <input type="number" :placeholder = '(typeof(column.filter.placeholder) == "undefined") ? "Filter " + column.label : column.filter.placeholder' v-model="column.filter.value" />
                  </span>

                  <span v-else-if="column.filter.type == 'date'">
                    <date-picker lang="en" format="DD/MM/YYYY" value-format="YYYY/MM/DD" :first-day-of-week="1" v-model="column.filter.value"></date-picker>
                  </span>
                  <span v-else-if="column.filter.type == 'daterange'">
                    <date-picker lang="en" format="DD/MM/YYYY" value-format="YYYY/MM/DD" range :first-day-of-week="1" v-model="column.filter.value"></date-picker>
                  </span>

                  <span v-else-if="column.filter.type == 'select'">
                    <!-- <v-select @input="filterTable" v-if='column.filter.values' :options='column.filter.values' :label="column.filter.labelField" :placeholder = '(typeof(column.filter.placeholder) == "undefined") ? "Filter " + column.label : column.filter.placeholder' v-model="column.filter.value"></v-select> -->
                    <no-ssr>
                      <treeselect v-if='column.filter.values'  v-model="column.filter.value" :multiple="true" :options="column.filter.values" @close="filterTable" />
                    </no-ssr>
                  </span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody v-if="!(data == undefined || data =='')">
            <tr v-for="row in dataClone" :key="row.id" :class='{clickable : rowsClickable !=undefined}' @click.prevent='rowClicked(row)'>
              <td v-if="checkboxes != undefined" class="Checkboxes"><input type="checkbox" class="uk-checkbox" :value="row" v-model="selectedData" /></td>
              <td v-for="(column, index) in columns" :key="index" v-if="column.show != false">
                <slot name="override" v-if="column.override == true" v-bind:row="row" v-bind:column='column'>Default Content</slot>
                <slot v-bind:row="row" v-bind:column='column' v-else>
                  <span v-if="column.type == 'date'">{{ formatDate(row[column.field], column.format) }}</span>
                  <span v-else>{{ row[column.field] }}</span>
                </slot>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td :colspan="columns.length">
                <div style="padding: 10em 3em; text-align: center;">No Data Available</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>
<script>
  import $ from 'jquery'
  import _ from 'lodash'
  import moment from 'moment'
  import Treeselect from '@riophae/vue-treeselect'
  export default {
    props: [ 'columns', 'data', 'checkboxes', 'loading', 'expanded', 'fixedHeader', 'height' ,'background', 'rowsClickable' ],
    components: { Treeselect },
    created () {
      this.setupData();
    },
    data () {
      return {
        appContentWidth: '100%',
        appTableWidth: '100%',
        isMounted: false,
        isUpdating: false,
        sort: {},
        dataClone: [],
        selectedData:[],
        allSelected: false,
        filters : {}
      }
    },
    methods: {
      filterTable() {
        let filters = {}
        this.columns.forEach(column => {
          if (column.filter && column.filter.value) {
            if (column.filter.type == "select") {
              // console.log('select', column.filter.value.label)
              filters[column.field] = column.filter.values.map()
              filters[column.field] = column.filter.value.label
              return
            }
            if (column.filter.type == "multiselect") {
              if (column.filter.value.length > 0) {
                filters[column.field] = column.filter.value.map(o => o["value"])
                return
              }
              return
            }
            filters[column.field] = column.filter.value
          }
        })
        if (_.isEqual(filters, this.filters)) {
          // console.log("filters match!")
        } else {
          this.filters = filters
          this.$emit("updateFilters", filters)
        }
      },
      setupData() {
        this.dataClone = _.cloneDeep(this.data)
        for(var i in this.columns) {
          if(this.columns.sort) {
            this.sort[this.columns[i].field] = 'none';
          }
        }
      },
      setWidths() {
        console.log('setting widths')
        if(this.fixedHeader != undefined) {
            var width = 0
            if(parseInt(this.$refs.AppTable.clientWidth) < parseInt(this.$refs.AppTableContainer.clientWidth)) {
              width = this.$refs.AppTableContainer.clientWidth
            } else {
              width = this.$refs.AppTable.clientWidth
            }
            // console.log(width)
            this.appTableWidth = (width-1) + 'px'
            this.appContentWidth = (width) + 'px'
        } else {
          this.appContentWidth = (parseInt(this.$refs.AppTableContainer.clientWidth)) + 'px'
        }
        this.isUpdating = false
      },
      formatDate(value, format) {
        return moment(value).format(format);
      },
      sortByFunction(column) {
        if(this.sort[column.field] != 'none') {
          switch(this.sort[column.field]) {
            case 'asc':
              this.sort[column.field] = 'desc'
              break;
            case 'desc':
              this.sort[column.field] = 'none'
              break;
            case 'none':
              this.sort[column.field] = 'asc'
              break;
          }
        } else {
          for(var i in this.sort) {
            this.sort[i] = 'none'
          }
          this.sort[column.field] = 'asc'
        }
        if(column.internalSort) {
          if(this.sort[column.field] == 'none') {
            this.dataClone = _.cloneDeep(this.data)
          } else {
            this.dataClone = _.orderBy(this.dataClone, [column.field], [this.sort[column.field]]);
          }
        } else {
          this.$emit('please-sort-the-data-by', this.sort)
        }
      },
      rowClicked(row) {
        if(this.rowsClickable != undefined) {
          this.$emit('rowClicked', row)
        }
      }
    },
    mounted () {
      setTimeout(() => { this.setWidths() }, 1000)
    },
    // updated () {
    //   this.setWidths()
    // },
    watch: {
      columns: {
        handler: function() {
          console.log('columns changed')
          this.setWidths()
        },
        deep: true
      },
      'data': function() {
        this.setWidths()
      },
      allSelected: {
        handler: function(to, from){
          if(to == true) {
            this.selectedData = _.cloneDeep(this.data)
          } else {
            this.selectedData = []
          }
        }
      },
      data: {
        handler: function() {
          this.setupData()
        },
        deep: true
      }
    }
  };
</script>
