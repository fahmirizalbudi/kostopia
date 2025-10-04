-- +migrate Up
-- +migrate StatementBegin
CREATE OR REPLACE FUNCTION update_room_on_rental_update()
RETURNS trigger AS $$
BEGIN
  IF OLD.status = 'active' AND NEW.status = 'finished' THEN
    UPDATE rooms
    SET 
      status = 'available'
    WHERE id = NEW.room_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_room_from_rental
AFTER UPDATE ON rentals
FOR EACH ROW
EXECUTE FUNCTION update_room_on_rental_update();
-- +migrate StatementEnd