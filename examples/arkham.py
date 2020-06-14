class Arkham_Asylum():
    
    def __init__(self, enemy, weapon):
        self.enemy = enemy
        self.weapon = weapon
    
    def attack(self):
        return f"{self.enemy} attacked using a {self.weapon}"
    
joker = Arkham_Asylum('Joker', 'Knife')
joker.attack()