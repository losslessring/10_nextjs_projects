// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S) =>
    S.list()
        .title('Blog')
        .items([
            S.documentTypeListItem('product').title('Product'),
            S.documentTypeListItem('category').title('Categories'),
            S.documentTypeListItem('author').title('Authors'),
            S.divider(),
            ...S.documentTypeListItems().filter(
                (item) =>
                    item.getId() &&
                    !['product', 'category', 'author'].includes(item.getId())
            ),
        ])
