from django.test import TestCase
from django.contrib.auth import get_user_model


class UsersManagersTests(TestCase):
    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(
            username='test user',
            first_name='test fn',
            last_name='test ln',
            password='foo',
        )
        self.assertEqual(user.username, 'test user')
        self.assertEqual(user.first_name, 'test fn')
        self.assertEqual(user.last_name, 'test ln')
        self.assertEqual(user.patronymic, '')
        self.assertIsNone(user.chief)
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_admin)
        try:
            self.assertIsNone(user.email)
        except AttributeError:
            pass
        with self.assertRaises(TypeError):
            User.objects.create_user()
        with self.assertRaises(ValueError):
            User.objects.create_user(username='')
        with self.assertRaises(ValueError):
            User.objects.create_user(username='', password="foo")

    def test_create_superuser(self):
        User = get_user_model()
        admin_user = User.objects.create_superuser(
            username='test admin',
            first_name='test admin fn',
            last_name='test admin ln',
            password='foo',
        )
        self.assertEqual(admin_user.username, 'test admin')
        self.assertEqual(admin_user.first_name, 'test admin fn')
        self.assertEqual(admin_user.last_name, 'test admin ln')
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_admin)
        try:
            self.assertIsNone(admin_user.email)
        except AttributeError:
            pass
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                username='test admin',
                first_name='test admin fn',
                last_name='test admin ln',
                password='foo',
                is_admin=False
            )
