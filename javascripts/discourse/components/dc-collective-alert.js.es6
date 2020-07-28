import computed from 'ember-addons/ember-computed-decorators'
import { ajax } from 'discourse/lib/ajax'

export default Ember.Component.extend({
  disabled: false,
  hidden: false,
  joined: false,
  sticky: false,

  classNameBindings: ['sticky:is-sticky'],

  @computed('joined')
  message(joined) {
    let message = I18n.t('discourse_debtcollective_collectives.alert')

    if (joined) {
      message = I18n.t('discourse_debtcollective_collectives.joined')
    }

    if (this.isTopic()) {
      message = I18n.t('discourse_debtcollective_collectives.topic')
    }

    return message
  },

  safeCategory() {
    let { category, topic } = this

    if (!category && topic) {
      category = topic.category
    }

    return category
  },

  isTopic() {
    return !!this.topic
  },

  isCollectiveMember() {
    const { currentUser } = this
    const category = this.safeCategory()

    if (!currentUser || !category || !this.isCategoryCollective(category)) {
      return false
    }

    const collectiveGroup = category.tdc_collective_group

    return currentUser.filteredGroups
      .map((item) => item.name)
      .includes(collectiveGroup.name)
  },

  isCategoryCollective(category) {
    return category && category.tdc_is_collective
  },

  // bind events for sticky scrolling
  didInsertElement() {
    this._super(...arguments)

    // set width of the container after render
    this.setAlertWidth()

    // bind resize to update width
    this.listenResize()

    // listen for clicks in reply buttons
    // only execute if member is not in collective
    if (!this.isCollectiveMember()) this.listenReplyClick()
  },

  listenResize() {
    $(window).on(
      'resize.collectiveAlert',
      _.debounce(() => {
        this.setAlertWidth()
      }, 150)
    )
  },

  listenReplyClick() {
    $('#main-outlet').on(
      'click.replyCollectiveAlert',
      'button[data-replynopermission], .btn-primary.create',
      () => {
        this.setSticky()
      }
    )
  },

  setSticky() {
    if (this.sticky) {
      return
    }

    this.set('sticky', true)

    // add more padding to topic-title to prevent alert from covering it
    // add a small separation;
    const alertHeight = $(this.element).outerHeight() + 14
    $('#topic-title').css('padding-top', `${alertHeight}px`)
  },

  setAlertWidth() {
    const mainOutletWidth = $('#main-outlet').width()

    $(this.element)
      .find('.alert-collective-alert')
      .css('width', `${mainOutletWidth}px`)
  },

  // unbind events and clean up
  willDestroyElement() {
    this._super(...arguments)

    // off resize event
    $(window).off('resize.collectiveAlert')

    // off reply click event
    $('#main-outlet').off('click.replyCollectiveAlert')
    $('#main-outlet').off('click.collectiveAlert')
  },

  didReceiveAttrs() {
    this._super(...arguments)
    let { category, currentUser, topic } = this

    if (topic) {
      category = topic.category
    }

    if (
      !currentUser ||
      !this.isCategoryCollective(category) ||
      this.isCollectiveMember()
    ) {
      return this.set('hidden', true)
    }

    return this.set('hidden', false)
  },

  actions: {
    join() {
      this.set('disabled', true)
      const categoryId = this.safeCategory().id

      ajax(`/collectives/${categoryId}/join`, {
        type: 'PUT',
        contentType: 'application/json',
      })
        .then(() => {
          this.set('joined', true)

          // reload to make the composer pick up permissions changes
          // improve this is we find a better way to do it
          window.location.href = window.location.href
        })
        .catch((error) => {
          throw error
        })
    },
  },
})
