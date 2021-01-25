<template>
  <div class='Tree'>
    <!-- eslint-disable-line -->
    <div class="TreeRow" v-for="row in data" v-bind:key='row[id]' :class='[levelClass, {"expanded" : expanded.includes(row[id]) }]'>
      <div class="RowContainer">
        <div class="Button">
          <a class="expandButton noselect" v-if='row[children]' @click.prevent='toggle(row[id])'>
            <span class="icon ti-angle-down" v-if='expanded.includes(row[id])'></span>
            <span v-else class="icon ti-angle-right"></span>
          </a>
          <span class="icon ti-control-record nochildren" v-else></span>
        </div>

        <div class='LabelContainer' :class='{"clickable noselect": labelOpensChildren && row[children], "expanded":expanded.includes(row[id]) }' @click.prevent='labelClicked(row)'>
          <slot name="input" v-bind='row'>
            <input type="checkbox" v-if="checkboxes" v-model="row.checked" @click.prevent.stop=checked(row)>
          </slot>
          <slot name='label' v-bind='row'>
            {{ row[label] }}
            <span class="count" v-if='row[children] && showCount'>
              ({{ row[children].length }})
            </span>
          </slot>
        </div>

        <div class="MiddleContainer">
          <slot name='middle' v-bind='row'></slot>
        </div>

        <div class="ActionsContainer">
          <slot name='actions' v-bind='row'></slot>
        </div>

      </div>

      <tree v-show='row[children] && expanded.includes(row[id])' :data='row[children]' id='id' label='name' :children='children' :showCount=showCount :labelOpensChildren='labelOpensChildren' :level='level+1'>
        <!-- Pass on all named slots -->
            <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot"/>

            <!-- Pass on all scoped slots -->
            <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope"><slot :name="slot" v-bind="scope"/></template>
      </tree>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      data: {
        required: true
      },
      id: String,
      label: String,
      children: String,
      showCount: Boolean,
      input: String,
      checkboxes: Boolean,
      labelOpensChildren: {
        type: Boolean,
        default: false
      },
      level: {
        type: Number,
        default: 0
      }
    },
    components: { Tree: () => import('~/components/Utils/Tree') },
    data() {
      return {
        expanded: []
      }
    },
    computed: {
      levelClass () { return this.level > 6 ? 'levelx' : 'level' + this.level }
    },
    methods: {
      checked(row) {
        row.checked = !row.checked
        for(let i in row[this.children]) {
          row[this.children][i].checked = row.checked
        }
      },
      toggle(id) {
        if(this.expanded.indexOf(id) != -1) {
          this.expanded.splice(this.expanded.indexOf(id), 1);
        } else {
          this.expanded.push(id)
        }
      },
      labelClicked(row) {
        if(row[this.children]) {
          if(this.labelOpensChildren) {
            this.toggle(row[this.id])
          }
        }
        this.$emit('labelClicked', row)
      }
    }
  }
</script>
