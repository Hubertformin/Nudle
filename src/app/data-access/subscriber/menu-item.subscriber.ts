// menu item subscriber:
import {EntitySubscriberInterface, EventSubscriber, UpdateEvent} from 'typeorm';
import {ItemEntity, MenuItemEntity} from '../entities';

/**
 * @class
 * @name MenuItemSubscriber
 * @description listen to menu items table
 * */
@EventSubscriber()
export class MenuItemSubscriber implements EntitySubscriberInterface<MenuItemEntity> {
    listenTo() {
        return MenuItemEntity;
    }
    afterUpdate(event: UpdateEvent<MenuItemEntity>): Promise<any> | void {
        if (!event.entity.stackable && event.entity.ingredients.length > 0) {
            event.entity.ingredients.forEach(el => {
                ItemEntity.createQueryBuilder()
                    .update()
                    .set({quantity: () => `quantity - ${el.quantity}`})
                    .where({id: el.itemId})
                    .execute();
            })
        }
    }
}
