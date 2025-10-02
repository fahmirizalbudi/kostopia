-- +migrate Up
-- +migrate StatementBegin
CREATE OR REPLACE FUNCTION update_rental_on_transaction_update()
RETURNS trigger AS $$
BEGIN
  IF OLD.status = 'pending' AND NEW.status = 'success' AND OLD.purpose = 'renewal' THEN
    UPDATE rentals
    SET 
      duration_months = duration_months + NEW.month_paid,
      end_date = end_date + (NEW.month_paid || ' months')::interval
    WHERE id = NEW.rental_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_rental_from_transaction
AFTER UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_rental_on_transaction_update();
-- +migrate StatementEnd