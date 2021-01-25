<template>
  <div class="AppTableContainer" :class="{ Expanded : expanded, FixedHeader: fixedHeader == 'true', Heighted: height, White: background == 'true' }" :style="'height:' + height" width="100%" ref="AppTableContainer">
    <div class="Loader" :class="{Loading: loading}" :style="'width:' + appTableWidth"></div>
    <div class="FixedHeaderContent" v-if="fixedHeader == 'true'" id="FixedHeader" :style="'width:' + appContentWidth">
      <table class="AppTable FixedHeader" v-if="fixedHeader" :style="'width:' + appTableWidth">
        <thead>
          <tr>
            <th v-if="checkboxes == 'true'"><input type="checkbox" v-model="allSelected" /></th>
            <th v-for="(column, index) in columns" :key="index" v-if="column.show != false" :class="{'Sortable':column.sort, 'WidthDefined': column.width != undefined}" :width='column.width == undefined ? "auto" : column.width'>
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
        <thead>
          <tr class="Filters">
            <th class="Filter" v-if="checkboxes == 'true'"><span v-if="selectedData" style='font-size: 10px; text-align: center; display: block'>{{ selectedData.length }}</span></th>
            <th class="Filter" v-for="(column, index) in columns" :key="index" v-if="column.show != false" :class="{ 'Active' : (column.filter != undefined && column.filter.value != '' && column.filter.value != null) }">
              <span v-if="column.filter">
                <span v-if="column.filter.type == 'text'">
                  <input type="text" :placeholder='(typeof(column.filter.placeholder) == "undefined") ? "Filter " + column.label : column.filter.placeholder' v-model="column.filter.value" @blur="filterTable" />
                </span>
                <span v-else-if=" column.filter.type == 'number' ">
                  <input type="number" :placeholder='(typeof(column.filter.placeholder) == "undefined") ? "Filter " + column.label : column.filter.placeholder' v-model="column.filter.value" @blur="filterTable" />
                </span>
                <span v-else-if="column.filter.type == 'date'">
                  <no-ssr>
                    <date-picker lang="en" format="DD/MM/YYYY" :first-day-of-week="1" v-model="column.filter.value" @change="filterTable"></date-picker>
                  </no-ssr>
                </span>
                <span v-else-if="column.filter.type == 'daterange'">
                  <no-ssr>
                    <date-picker lang="en" format="DD/MM/YYYY" range :first-day-of-week="1" v-model="column.filter.value" @change="filterTable" confirm></date-picker>
                  </no-ssr>
                </span>
                <span v-else-if="column.filter.type == 'time'">
                  <no-ssr>
                    <date-picker type="time" lang="en" format="H:mm" range confirm v-model="column.filter.value" @change="filterTable" placeholder="select time"></date-picker>
                  </no-ssr>
                </span>
                <span v-else-if="column.filter.type == 'select'">
                  <no-ssr>
                    <v-selectpage v-if='column.filter.values' :title='(typeof(column.filter.placeholder) == "undefined") ? "Filter " + column.label : column.filter.placeholder' placeholder='Filter'  :data="column.filter.values" :key-field="column.filter.labelField" v-model='column.filter.value' @values='filterTable' @removed='filterTable' :show-field="column.filter.labelField" :pagination="false"  ></v-selectpage>
                  </no-ssr>

                </span>
                <span v-else-if="column.filter.type == 'multiselect'">
                  <no-ssr>
                    <v-selectpage ref="ms1" :multiple="true" v-if='column.filter.values' :title='(typeof(column.filter.placeholder) == "undefined") ? "Filter " + column.label : column.filter.placeholder' placeholder='Filter'  :data="column.filter.values" :key-field="column.filter.labelField" v-model='column.filter.value' @closing='filterTable' :show-field="column.filter.labelField" :pagination="false"  ></v-selectpage>
                  </no-ssr>
                </span>
              </span>
              <span v-else></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in dataClone" :key="row.id" :class='{clickable : rowsClickable !=undefined}'>
            <td v-if="checkboxes == 'true'"><input type="checkbox" :value="row" v-model="selectedData" /></td>
            <td v-for="(column, index) in columns" :key="index" v-if="column.show != false" :class="{WidthDefined: column.width != undefined}" :width='column.width == undefined ? "auto" : column.width' @click.prevent='rowClicked(row)'>
              <slot name="override" v-if="column.override == true" v-bind:row="row" v-bind:column='column'>Default Content</slot>
              <slot v-bind:row="row" v-bind:column='column' v-else>
                <span v-if="column.type == 'date'">
                  <span v-if="row[column.field] == ''" class='na'>--</span>
                  <span v-else>{{ formatDate(row[column.field], column.format) }}</span>
                </span>
                <span v-else-if="column.type == 'time'">
                  <span v-if="row[column.field] == ''" class='na'>--</span>
                  <span v-else>{{ formatTime(row[column.field], column.format) }}</span>
                </span>
                <span v-else-if="row[column.field] == null || row[column.field] == ''" class='na'>--</span>
                <span v-else>{{ row[column.field] }}</span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="AppTableContent" id="AppTableContent" ref='AppTableContent' :style="'width:' + appContentWidth">
      <table class="AppTable" id="AppTable" ref='AppTable' :class="{RemoveHeaders : fixedHeader == 'true'}" :style="'width:' + appTableWidth">
        <thead :class="{ zeroHeight: fixedHeader == 'true' }">
          <tr>
            <th v-if="checkboxes == 'true'"><input type="checkbox" /></th>
            <th v-for="(column, index) in columns" :key="index" v-if="column.show != false" :class="{'Sortable':column.sort, 'WidthDefined': column.width != undefined}" :width='column.width == undefined ? "auto" : column.width'>
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
        <thead>
          <tr class="Filters">
            <th class="Filter" v-if="checkboxes == 'true'"><span v-if="selectedData" style='font-size: 10px; text-align: center; display: block'>{{ selectedData.length }}</span></th>
            <th class="Filter" v-for="(column, index) in columns" :key="index" v-if="column.show != false" :class="{ 'Active' : (column.filter != undefined && column.filter.value != '' && column.filter.value != null) }">
              <span v-if="column.filter">
                <span v-if="column.filter.type == 'text'">
                  <input type="text" :placeholder='(typeof(column.filter.placeholder) == "undefined") ? "Filter " + column.label : column.filter.placeholder' v-model="column.filter.value" @blur="filterTable" />
                </span>
                <span v-else-if=" column.filter.type == 'number' ">
                  <input type="number" :placeholder='(typeof(column.filter.placeholder) == "undefined") ? "Filter " + column.label : column.filter.placeholder' v-model="column.filter.value" @blur="filterTable" />
                </span>
                <span v-else-if="column.filter.type == 'date'">
                  <no-ssr>
                    <date-picker lang="en" format="DD/MM/YYYY" :first-day-of-week="1" v-model="column.filter.value" @change="filterTable"></date-picker>
                  </no-ssr>
                </span>
                <span v-else-if="column.filter.type == 'daterange'">
                  <no-ssr>
                    <date-picker lang="en" format="DD/MM/YYYY" range :first-day-of-week="1" v-model="column.filter.value" @change="filterTable" confirm></date-picker>
                  </no-ssr>
                </span>
                <span v-else-if="column.filter.type == 'time'">
                  <no-ssr>
                    <date-picker type="time" lang="en" format="H:mm" range confirm v-model="column.filter.value" @change="filterTable" placeholder="select time"></date-picker>
                  </no-ssr>
                </span>
                <span v-else-if="column.filter.type == 'select'">
                  <no-ssr>
                    <!-- <v-select v-if='column.filter.values' :options='column.filter.values' :label="column.filter.labelField" :placeholder='(typeof(column.filter.placeholder) == "undefined") ? "Filter " + column.label : column.filter.placeholder' v-model="column.filter.value" @input="filterTable"></v-select> -->
                    <!-- <treeselect v-if='column.filter.values'  v-model="column.filter.value" :options="column.filter.values" valueFormat="object" @deselect='setSelectFilter' @select="setSelectFilter" :label="column.filter.labelField" /> -->
                    <v-selectpage v-if='column.filter.values' :title='(typeof(column.filter.placeholder) == "undefined") ? "Filter " + column.label : column.filter.placeholder' placeholder='Filter' :data="column.filter.values" :key-field="column.filter.labelField" v-model='column.filter.value' @values='filterTable' @removed='filterTable' :show-field="column.filter.labelField" :pagination="false"  ></v-selectpage>
                  </no-ssr>
                </span>
                <span v-else-if="column.filter.type == 'multiselect'">
                  <no-ssr>
                    <v-selectpage ref="ms1" :multiple="true" v-if='column.filter.values' :title='(typeof(column.filter.placeholder) == "undefined") ? "Filter " + column.label : column.filter.placeholder' placeholder='Filter'  :data="column.filter.values" :key-field="column.filter.labelField" v-model='column.filter.value' @closing='filterTable' :show-field="column.filter.labelField" :pagination="false"  ></v-selectpage>
                  </no-ssr>
                </span>
              </span>
              <span v-else></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in dataClone" :key="row.id" :class='{clickable : rowsClickable !=undefined}'>
            <td v-if="checkboxes == 'true'"><input type="checkbox" :value="row" v-model="selectedData" /></td>
            <td v-for="(column, index) in columns" :key="index" v-if="column.show != false" :width='column.width == undefined ? "auto" : column.width' :class="{WidthDefined: column.width != undefined}" @click.prevent='rowClicked(row)'>
              <slot name="override" v-if="column.override == true" v-bind:row="row" v-bind:column='column'>Default Content</slot>
              <slot v-bind:row="row" v-bind:column='column' v-else>
                <span v-if="column.type == 'date'">
                  <span v-if="row[column.field] == '' || row[column.field] == null" class='na'>--</span>
                  <span v-else>{{ formatDate(row[column.field], column.format) }}</span>
                </span>
                <span v-else-if="column.type == 'time'">
                  <span v-if="row[column.field] == ''" class='na'>--</span>
                  <span v-else>{{ formatTime(row[column.field], column.format) }}</span>
                </span>
                <span v-else-if="row[column.field] == null || row[column.field] == ''" class='na'>--</span>
                <span v-else>{{ row[column.field] }}</span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-pagination v-if="pagination" class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[30, 100, 150, 200]" :page-size="chunk" layout="total, sizes, prev, pager, next, jumper" :total="count">
    </el-pagination>
  </div>
</template>
<script>
import $ from "jquery"
import _ from "lodash"
import moment from "moment"
export default {
  props: [
    "pagination",
    "columns",
    "count",
    "data",
    "checkboxes",
    "expanded",
    "fixedHeader",
    "height",
    "background",
    "offset",
    "chunk",
    "sortOrder",
    "sortField",
    "rowsClickable",
    "loading"
  ],
  created() {
    this.setupData()
  },
  mounted() {
    setTimeout(() => {
      this.setWidths()
    }, 500)
  },
  data() {
    return {
      appContentWidth: "100%",
      appTableWidth: "100%",
      isMounted: false,
      isUpdating: false,
      sort: {},
      dataClone: [],
      selectedData: [],
      allSelected: false,
      updateInterval: 0,
      filters: {}
    }
  },
  methods: {
    setSelectFilter(a,b) {
      this.$nextTick(() => {
        this.filterTable()
      })
    },
    handleSizeChange(val) {
      // this.chunk = val
      this.$refs.AppTable.scrollTop = 0
      this.$emit("changePage", {
        chunk: val,
        offset: this.offset
      })
    },
    handleCurrentChange(val) {
      this.$refs.AppTable.scrollTop = 0
      // this.offset = this.chunk * (val - 1)
      this.$emit("changePage", {
        chunk: this.chunk,
        offset: this.chunk * (val - 1)
      })
    },
    filterTable() {
      let filters = {}
      this.columns.forEach(column => {
        // console.log(column.filter)
        if (column.filter && column.filter.value) {
          //edge case
          if (column.field == "is_active" && column.filter.value == "Yes") {
            filters[column.field] = true
            return
          }
          // edge case for attendee
          if (column.field == "status" && column.filter.value == "Yes") {
            filters[column.field] = true
            return
          }
          if (column.filter.type == "date") {
            filters[column.field] = column.filter.value
              ? moment(column.filter.value).format("YYYY-MM-DD")
              : ""
            return
          }
          if (column.filter.type == "daterange") {
            filters[column.field] = {
              start_date: column.filter.value[0]
                ? moment(column.filter.value[0]).format("YYYY-MM-DD")
                : "",
              end_date: column.filter.value[1]
                ? moment(column.filter.value[1]).format("YYYY-MM-DD")
                : ""
            }
            return
          }
          if (column.filter.type == "select") {
            filters[column.field] = column.filter.value
            return
          }
          if (column.filter.type == "multiselect") {
              if (column.filter.value.length > 0) {
                filters[column.field] = column.filter.value.split(",")
                return
              }
            return
          }
          if (column.filter.type == "time") {
            filters[column.field] = {
              start_time: column.filter.value[0]
                ? moment(column.filter.value[0]).format("H:mm")
                : "",
              end_time: column.filter.value[1]
                ? moment(column.filter.value[1]).format("H:mm")
                : ""
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
      for (var i in this.columns) {
        if (this.columns.sort) {
          this.sort[this.columns[i].field] = "none"
        }
        if (this.columns[i].field == this.sortField) {
          this.sort[this.columns[i].field] = this.sortOrder
        }
      }
    },
    setWidths() {
      // console.log("setting widths")
      this.isUpdating = true
      if (this.fixedHeader == "true") {
        var width = 0
        if (
          parseInt(this.$refs.AppTable.clientWidth) <
          parseInt(this.$refs.AppTableContainer.clientWidth)
        ) {
          width = this.$refs.AppTableContainer.clientWidth
        } else {
          width = this.$refs.AppTable.clientWidth
        }
        this.appTableWidth = width + "px"
        this.appContentWidth = width + 20 + "px"
      } else {
        this.appContentWidth = this.$refs.AppTableContainer.clientWidth + "px"
      }
      this.isUpdating = false
      this.updateInterval = false
    },
    formatDate(value, format) {
      if (value) {
        return moment(value).format(format)
      } else {
        return ""
      }
    },
    formatTime(value, format) {
      if (value) {
        return moment(value, "HH:mm:ss").format(format)
      } else {
        return ""
      }
    },
    sortByFunction(column) {
      if (this.sort[column.field] != "none") {
        switch (this.sort[column.field]) {
          case "asc":
            this.sort[column.field] = "desc"
            break
          case "desc":
            this.sort[column.field] = "none"
            break
          case "none":
            this.sort[column.field] = "asc"
            break
        }
      } else {
        for (let i in this.sort) {
          this.sort[i] = "none"
        }
        this.sort[column.field] = "asc"
      }
      if (column.internalSort) {
        if (this.sort[column.field] == "none") {
          this.dataClone = _.cloneDeep(this.data)
        } else {
          this.dataClone = _.orderBy(
            this.dataClone,
            [column.field],
            [this.sort[column.field]]
          )
        }
      } else {
        let args = {
          sort: this.sort,
          field: column.field
        }
        this.$emit("please-sort-the-data-by", args)
      }
    },
    rowClicked(row) {
      if (this.rowsClickable != undefined) {
        this.$emit("rowClicked", row)
      }
    }
  },
  updated() {
    // this.setWidths()
    // console.log("setting widths running")
    if (!this.updateInterval) {
      this.updateInterval = setTimeout(() => {
        this.setWidths()
      }, 3000)
    }
  },
  watch: {
    allSelected: {
      handler: function(to, from) {
        if (to == true) {
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

<style scoped>
.pagination {
  position: fixed;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
}
.Loader {
  background: linear-gradient(180deg, rgba(230,230,230,.7), #fff, rgba(230,230,230,.7));
  background-size: 600% 600%;
  -webkit-animation: AnimationName 3s ease infinite;
  -moz-animation: AnimationName 3s ease infinite;
  animation: AnimationName 3s ease infinite;
}


@-webkit-keyframes AnimationName {
    0%{background-position:51% 0%}
    50%{background-position:50% 100%}
    100%{background-position:51% 0%}
}
@-moz-keyframes AnimationName {
    0%{background-position:51% 0%}
    50%{background-position:50% 100%}
    100%{background-position:51% 0%}
}
@keyframes AnimationName {
    0%{background-position:51% 0%}
    50%{background-position:50% 100%}
    100%{background-position:51% 0%}
}
</style>
