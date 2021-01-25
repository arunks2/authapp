<template>
  <div>
    <table class="ItemsTable">
      <thead>
        <tr>
          <th style='width:70px'>Image</th>
          <th>Item</th>
          <th style='width:200px'>Type</th>
          <th style='width:100px;'>Pieces</th>
          <th style='width:20px;'></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in this.finalItems" :key='item.id'>
          <td><img src='~/assets/img/packet.png'></td>
          <td>{{ item.name }} <span class="info">({{ item.design_number }})</span></td>
          <td>{{ item.type }}</td>
          <td>{{ item.pieces }}</td>
          <td><a href="#" @click.prevent='removeItemAndSet(item)'><span class="icon ti-close"></span></a></td>
        </tr>
        <tr>
          <td colspan=5>
            <a href="#" style='display: block' @click.prevent='showAddPanel = true'><span class="icon ti-plus"></span> Add Item</a>
          </td>
        </tr>
      </tbody>
    </table>
    <bold-panel tight :show.sync='showAddPanel'>
      <div style='padding: 1em;'>
        <h3>Available Inventory at Location (Location Name)</h3>
      </div>
      <bold-table filters :data='items' :columns='table'>
        <template slot='override' slot-scope='props'>
          <span v-if="props.column.field == 'image'">
            <img src='~/assets/img/packet.png'>
          </span>
          <span v-else-if="props.column.field == 'type'">
            <span v-if="props.row.type == 'barcode'">Barcode</span>
            <span v-if="props.row.type == 'packet'">Packet</span>
            <span v-if="props.row.type == 'loose'">Loose</span>
          </span>
          <span v-else-if='props.column.field == "pieces"'>
            <span v-if="props.row.type == 'barcode'" v-html='props.row.pieces'></span>
            <span v-if="props.row.type == 'packet'">
              <input type="text" class="uk-input" v-model='props.row.pieces'>
            </span>
            <span v-if="props.row.type == 'loose'">
              <input type="text" class="uk-input" v-model='props.row.pieces'>
            </span>
          </span>
          <span v-else-if="props.column.field == 'action'">
            <button class='Button FixedWidth Success' v-if="checkIfItemIsSelected(props.row.id)" @click.prevent='removeItem(props.row)'>
              <span class="icon ti-check"></span> Selected
            </button>
            <button v-else class="Button FixedWidth Action" @click.prevent='selectItem(props.row)'>Select</button>
          </span>
        </template>
      </bold-table>
      <div class="PanelFooter" v-if="this.selectedItems.length > 0">
          <div class='Info'>
            You've selected {{ this.selectedItems.length }} items.
          </div>
          <div class='Action'>
            <button class="uk-button uk-button-primary" @click.prevent='setSelected'>
              Add to Voucher
            </button>
          </div>
      </div>
    </bold-panel>
  </div>

</template>
<script>
  import _ from 'lodash'
  import {items, table} from '~/data/itemsforselection.js'
  import BoldPanel from '~/components/Utils/Panel.vue'
  import BoldTable from '~/components/Utils/Table.vue'
  export default {
    data() {
      return {
        showAddPanel: false,
        items, table,
        selectedItems: [],
        finalItems: []
      }
    },
    components: { BoldPanel, BoldTable },
    methods: {
      checkIfItemIsSelected(id) {
        for(var i in this.selectedItems) {
          if(this.selectedItems[i].id == id) {
            return true
          }
        }
      },
      selectItem(item) {
        var flag = 0
        for(var i in this.selectedItems) {
          if(this.selectedItems[i].id == item.id) {
            flag = 1
          }
        }
        if(flag == 0) {
          this.selectedItems.push(item)
        }
      },
      removeItem(item) {
        for(var i in this.selectedItems) {
          if(this.selectedItems[i].id == item.id) {
            this.selectedItems.splice(i,1)
          }
        }
      },
      removeItemAndSet(item) {
        for(var i in this.selectedItems) {
          if(this.selectedItems[i].id == item.id) {
            this.selectedItems.splice(i,1)
          }
        }
        this.setSelected()
      },
      setSelected() {
        this.showAddPanel = false
        this.finalItems = _.cloneDeep(this.selectedItems)
        this.$emit('itemsSelected', this.finalItems)
      }
    }
  };
</script>cx
