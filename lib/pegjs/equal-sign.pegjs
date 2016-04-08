start = equalSign

equalSign = "==" ' '? { return false; } / "=" ' '? { return true; }
