export class select extends list {
    /**
     *
     * @param change
     */
    render(change) {
        this.$el.outerHTML = `<select data-name="${change.path}" value="${change.value}" />`;
        return this.$el.outerHTML;
    }
}
